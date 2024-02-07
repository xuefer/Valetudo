import {useProgressQuery} from "../api";
import {Grid, Typography} from "@mui/material";
import {HourglassTop as ProgressIcon} from "@mui/icons-material";
import React from "react";
import {getFriendlyProgressName, getHumanReadableProgress} from "../utils";
import ControlsCard from "./ControlsCard";

const Progress = (): React.ReactElement => {
    const {
        data: progresses,
    } = useProgressQuery();

    const body = React.useMemo(() => {
        if (!Array.isArray(progresses) || progresses.length === 0) {
            return null;
        }
        return progresses.filter((progress, i) => progress.type !== "battery").map((progress, i) => {
            const friendlyName = getFriendlyProgressName(progress);
            if (!friendlyName) {
                return;
            }
            const [ value, ] = getHumanReadableProgress(progress);
            return (
                <Grid item xs container direction="column" key={i}>
                    <Grid item>
                        <Typography variant="subtitle2">
                            {friendlyName}
                        </Typography>
                    </Grid>
                    <Grid item style={{maxHeight: "2rem"}}>{value}</Grid>
                </Grid>
            );
        });
    }, [
        progresses
    ]);

    if (!Array.isArray(progresses) || progresses.length === 0) {
        return <></>;
    }

    return (
        <ControlsCard icon={ProgressIcon} title="Clean Estimate">
            <Grid container direction="row">
                {body}
            </Grid>
        </ControlsCard>
    );
};

export default Progress;
