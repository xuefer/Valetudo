import {
    Grid,
    LinearProgress,
    linearProgressClasses,
    styled,
    Typography,
} from "@mui/material";
import { green, red, yellow } from "@mui/material/colors";
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

const batteryLevelColors = {
    red: red[500],
    yellow: yellow[700],
    green: green[500],
};

const estimateBatteryColor = "#DF5618";

const getBatteryColor = (level: number): "red" | "yellow" | "green" => {
    if (level > 60) {
        return "green";
    }

    if (level > 20) {
        return "yellow";
    }

    return "red";
};

const BatteryProgress = styled(RatioBar)(({ theme }) => {
    return {
        marginTop: -theme.spacing(1),
        [`& .${ratioBarClasses.ratioBarBase}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],

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
            return (
                <Grid item container direction="column" key={index}>
                    <Grid item>
                        <Typography
                            variant="overline"
                            style={{
                                color: batteryLevelColors[getBatteryColor(battery.level)],
                            }}
                        >
                            Battery{batteries.length > 1 ? ` ${index+1}`: ""}: {Math.round(battery.level)}%
                        </Typography>
                    </Grid>
                    <Grid item sx={{ flexGrow: 1, minHeight: "1rem"}}>
                        <BatteryProgress
                            total={100}
                            partitions={
                                [
                                    {
                                        value: battery.level - batteryEstimate,
                                        color: getBatteryColor(battery.level)
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
                    </Grid>
                </Grid>
            );
        });
    }, [batteries, isBatteryError, progresses]);

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
            <Grid container direction="column">
                <Grid item container direction="row" position="relative">
                    {progresses !== undefined && progresses.length !== undefined && progressDetails}
                    <Grid item zIndex="1">
                        {stateDetails}
                    </Grid>
                </Grid>
                {batteries !== undefined && batteries.length > 0 && (
                    <Grid item container direction="row" width="100%">
                        {batteriesDetails}
                    </Grid>
                )}
            </Grid>
        </ControlsCard>
    );
};

export default RobotStatus;
