import React from "react";
import {
  Grid,
  Tabs,
  Tab,
  AppBar,
  GridList,
  GridListTile
} from "@material-ui/core";
import { QueryBar } from "./QueryBar";
import { makeStyles } from "@material-ui/styles";
import { StockPriceChart } from "./StockPriceChart";
import { useSelector } from "react-redux";
import { IState } from "../store/reducer";
import { SideList } from "./SideList";
import { IEntity } from "../interfaces/Entity";
import { EntityPanel } from "./EntityPanel";

const useEntities = () => {
  return useSelector((state: IState) => state.entities);
};

const useStyles = makeStyles({
  root: {
    padding: "1rem 0.5rem"
  },
  chartContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  chartContainerParent: {
    position: "relative"
  }
});

export const MainPage: React.FC = () => {
  const classes = useStyles();
  const entities = useEntities();

  return (
    <Grid container direction="column" className={classes.root} spacing={1}>
      <Grid item container justify="center">
        <Grid item xs={12} sm={10}>
          <QueryBar />
        </Grid>
      </Grid>
      <Grid item container direction="row" spacing={2} justify="center">
        {/* charts */}
        <Grid
          item
          container
          direction="column"
          spacing={2}
        >
          {entities.map((entity, index) => {
            return (
              <Grid item key={index}>
                {/* <div className={classes.chartContainerParent}>
                  <Grid item className={classes.chartContainer}>
                    <StockPriceChart entity={entity} />
                  </Grid>
                </div> */}
                <EntityPanel entity={entity} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
