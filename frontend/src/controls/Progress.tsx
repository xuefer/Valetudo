import {useProgressQuery} from "../api";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {HourglassTop as ProgressIcon} from "@mui/icons-material";
import React from "react";
import {getFriendlyProgressName, getHumanReadableProgress} from "../utils";

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
        <Grid item>
            <Paper>
                <Grid container direction="column">
                    <Box px={2} pt={1}>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><ProgressIcon/></Grid>
                            <Grid item>
                                <Typography variant="subtitle1">
                                    Clean Estimate
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" sx={{paddingBottom: "8px", paddingTop: "8px", maxHeight: "4em"}}>
                            {body}
                        </Grid>
                    </Box>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Progress;
