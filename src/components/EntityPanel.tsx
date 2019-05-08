import React, { useState } from "react";
import { IEntity, ITickerEntity } from "../interfaces/Entity";
import { Grid, makeStyles, Tabs, Tab } from "@material-ui/core";
import { StockPriceChart } from "./StockPriceChart";
import { SideList } from "./SideList";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import moment, { Moment } from "moment";

function shouldOpenSideList(entity: IEntity) {
  if (entity.type === "Combination") {
    return entity.queries.some(query => Boolean(query.base));
  } else if (entity.type === "TickerEntity") {
    return Boolean(entity.base);
  }
  return false;
}


function getNotBefore(rangeIndex: number) {
  let result = moment("20180327");

  switch (rangeIndex) {
    case 0:
      result.subtract(1, "week");
      break;
    case 1:
      result.subtract(1, "month");
      break;
    case 2:
      result.subtract(3, "months");
      break;
    case 3:
      result.subtract(6, "months");
      break;
    case 4:
      result.subtract(1, "year");
      break;
    case 5:
      result.subtract(5, "years");
      break;
    default:
      result = moment("19450101");
      break;
  }
  return result;
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
  },
  growUpContainer: {
    // height: "24rem",
    flexGrow: 1
  },
});

interface IProps {
  entity: IEntity;
}

export const EntityPanel: React.FC<IProps> = ({ entity }) => {
  const theme = useTheme() as any;
  const isWideScreen = useMediaQuery(theme.breakpoints.up("md"));

  const classes = useStyles();

  const isOpenSideList = shouldOpenSideList(entity);

  const [tabId, setTabId] = useState(0);

  const [timeRange, setTimeRange] = React.useState(0);  

  let notBefore = getNotBefore(timeRange);

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
            <StockPriceChart entity={entity} timeRange={timeRange} setTimeRange={setTimeRange} notBefore={notBefore}/>
          </Grid>
          {isOpenSideList && (
            <Grid item container direction="column" md={3}>
              <SideList entity={entity} notBefore={notBefore}/>
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
                  centered
                >
                  <Tab label="Chart" />
                  {isOpenSideList && <Tab label="Close Prices" />}
                </Tabs>
              </div>
            </div>
          </Grid>
          <Grid item container className={classes.growUpContainer}>
            {tabId === 0 && <StockPriceChart entity={entity} timeRange={timeRange} setTimeRange={setTimeRange} notBefore={notBefore}/>}
            {isOpenSideList && tabId === 1 && <SideList entity={entity} notBefore={notBefore}/>}
          </Grid>
        </Grid>
      )}
    </>
  );
};
