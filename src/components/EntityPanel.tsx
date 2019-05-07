import React, { useState } from "react";
import { IEntity, ITickerEntity } from "../interfaces/Entity";
import { Grid, makeStyles, Tabs, Tab } from "@material-ui/core";
import { StockPriceChart } from "./StockPriceChart";
import { SideList } from "./SideList";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

function shouldOpenSideList(entity: IEntity) {
  if (entity.type === "Combination") {
    return entity.queries.some(query => Boolean(query.base));
  } else if (entity.type === "TickerEntity") {
    return Boolean(entity.base);
  }
  return false;
}

const useStyles = makeStyles({
  wideContainer: {
    height: "24rem"
  },
  tabWrapperParent: {
    position: "relative",
    overflow: "hidden",
    height: "3rem"
  },
  tabWrapper: {
    position: "absolute",
    left: 0,
    right: 0
  }
});

interface IProps {
  entity: IEntity;
}

export const EntityPanel: React.FC<IProps> = ({ entity }) => {
  const theme = useTheme() as any;
  const isWideScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const classes = useStyles();

  const isOpenSideList = shouldOpenSideList(entity);

  const [tabId, setTabId] = useState(0);

  return (
    <>
      {isWideScreen && (
        <Grid
          container
          justify="center"
          spacing={1}
          className={classes.wideContainer}
        >
          {/* chart */}
          <Grid
            item
            container
            direction="column"
            md={isOpenSideList ? 9 : 12}
            lg={isOpenSideList ? 7 : 10}
          >
            <StockPriceChart entity={entity} />
          </Grid>
          {isOpenSideList && (
            <Grid item container direction="column" md={3}>
              <SideList entity={entity} />
            </Grid>
          )}
        </Grid>
      )}
      {!isWideScreen && (
        <Grid container direction="column" className={classes.wideContainer}>
          <Grid item>
            <div className={classes.tabWrapperParent}>
              <div className={classes.tabWrapper}>
                <Tabs
                  value={tabId}
                  onChange={(event: any, value: any) => setTabId(value)}
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  <Tab label="Chart" />
                  {isOpenSideList && <Tab label="Close Prices" />}
                </Tabs>
              </div>
            </div>
          </Grid>
          <Grid item>
            {tabId === 0 && <StockPriceChart entity={entity} />}
            {isOpenSideList && tabId === 1 && <SideList entity={entity} />}
          </Grid>
        </Grid>
      )}
    </>
  );
};
