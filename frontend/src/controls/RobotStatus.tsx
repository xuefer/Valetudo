import {
    Grid2,
    LinearProgress,
    linearProgressClasses,
    styled,
    Typography,
} from "@mui/material";
import RatioBar from "../components/RatioBar";
import ratioBarClasses from "../components/RatioBar.module.css";
import React from "react";
import {
    RobotAttributeClass,
    useRobotAttributeQuery,
    useRobotStatusQuery,
    useProgressQuery,
} from "../api";
import {RobotMonochromeIcon} from "../components/CustomIcons";
import ControlsCard from "./ControlsCard";
import {useValetudoColorsInverse} from "../hooks/useValetudoColors";

const BatteryProgress = styled(RatioBar)(({ theme }) => {
    return {
        marginTop: -theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        [`& .${ratioBarClasses.ratioBarBase}`]: {
            backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
            "& :nth-child(1)": {
                opacity: 0.3,
            }
        },
    };
});

const CleanProgress = styled(LinearProgress)(({ theme }) => {
    return {
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        borderRadius: theme.shape.borderRadius,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: "transparent",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
        },
        [`& .${linearProgressClasses.bar}`]: {
            backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
        },
    };
});

const RobotStatus = (): React.ReactElement => {
    const palette = useValetudoColorsInverse();
    const {
        data: status,
        isPending: isStatusPending,
        isError: isStatusError,
    } = useRobotStatusQuery();
    const {
        data: batteries,
        isPending: isBatteryPending,
        isError: isBatteryError,
    } = useRobotAttributeQuery(RobotAttributeClass.BatteryState);
    const {
        data: progresses,
        isPending: isProgressPending,
        isError: isProgressError,
    } = useProgressQuery();

    const isPending = isStatusPending || isBatteryPending || isProgressPending;

    const stateDetails = React.useMemo(() => {
        if (isStatusError) {
            return <Typography color="error">Error loading robot state</Typography>;
        }

        if (status === undefined) {
            return null;
        }

        return (
            <Typography variant="overline">
                {status.value}
                {status.flag !== "none" ? <> &ndash; {status.flag}</> : ""}
            </Typography>
        );
    }, [isStatusError, status]);

    const batteriesDetails = React.useMemo(() => {
        const getBatteryColor = (level: number) => {
            if (level > 60) {
                return palette.green;
            }
            if (level > 20) {
                return palette.yellow;
            }
            return palette.red;
        };

        if (isBatteryError) {
            return <Typography color="error">Error loading battery state</Typography>;
        }

        if (batteries === undefined) {
            return null;
        }

        if (batteries.length === 0) {
            return <Typography color="textSecondary">No batteries found</Typography>;
        }

        const batteryProgress = (Array.isArray(progresses) && progresses.length !== 0) ?
            progresses.filter((progress) => progress.type === "battery") :
            [];

        return batteries.map((battery, index) => {
            const batteryUsed = batteryProgress[index]?.value ?? 0;
            const batteryEstimate = (batteryProgress[index]?.total ?? 0) - batteryUsed;
            const batteryColor = getBatteryColor(battery.level);
            const estimateBatteryColor = palette.red;

            return (
                <Grid2 size="grow" container direction="column" key={index}>
                    <Grid2>
                        <Typography
                            variant="overline"
                            style={{
                                color: batteryColor,
                                fontWeight: 500
                            }}
                        >
                            Battery{batteries.length > 1 ? ` ${index + 1}` : ""}: {Math.round(battery.level)}%
                        </Typography>
                    </Grid2>
                    <Grid2 sx={{ flexGrow: 1, minHeight: "1rem" }}>
                        <BatteryProgress
                            total={100}
                            partitions={
                                [
                                    {
                                        value: battery.level - batteryEstimate,
                                        color: batteryColor
                                    },
                                    {
                                        value: batteryEstimate,
                                        color: estimateBatteryColor
                                    },
                                    {
                                        value: batteryUsed,
                                        color: estimateBatteryColor
                                    }
                                ]
                            }
                        />
                    </Grid2>
                </Grid2>
            );
        });
    }, [batteries, isBatteryError, palette, progresses]);

    const progressDetails = React.useMemo(() => {
        if (isProgressError) {
            return <Typography color="error">Error loading progress</Typography>;
        }

        if (!Array.isArray(progresses)) {
            return null;
        }

        for (const progress of progresses) {
            if (progress.type === "percent") {
                return (
                    <CleanProgress value={progress.value} variant="determinate" />
                );
            }
        }
    }, [progresses, isProgressError]);

    return (
        <ControlsCard
            icon={RobotMonochromeIcon}
            title="Robot"
            isLoading={isPending}
        >
            <Grid2 size="grow" container direction="column">
                <Grid2 container direction="row" position="relative">
                    {progresses !== undefined && progresses.length !== undefined && progressDetails}
                    <Grid2 zIndex="1">
                        {stateDetails}
                    </Grid2>
                </Grid2>
                {batteries !== undefined && batteries.length > 0 && (
                    <Grid2 size="grow" container direction="row" width="100%">
                        {batteriesDetails}
                    </Grid2>
                )}
            </Grid2>
        </ControlsCard>
    );
};

export default RobotStatus;
