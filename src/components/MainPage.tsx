import React from "react";
import { Grid } from "@material-ui/core";
import { QueryBar } from "./InputBar";
import { makeStyles } from "@material-ui/styles";
import { StockPriceChart } from "./StockPriceChart";
import { useSelector } from "react-redux";
import { IState } from "../store/reducer";

const useStyles = makeStyles({
  root: {
    padding: "1rem 0.5rem"
  }
});

const useEntities = () => {
  return useSelector((state: IState) => state.entities);
};

export const MainPage: React.FC = () => {
  const classes = useStyles();
  const entities = useEntities();

  return (
    <Grid container direction="column" className={classes.root} spacing={1}>
      <Grid item>
        <Grid container justify="center">
          <Grid item xs={12} sm={10}>
            <QueryBar />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container justify="center" spacing={2}>
          {entities.map((entity, index) => {
            return (
              <Grid item xs={12} sm={10} key={index}>
                <StockPriceChart entity={entity} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
