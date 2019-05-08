import React, { useState } from "react";
import { IEntity } from "../interfaces/Entity";
import { Grid, makeStyles, Tabs, Tab } from "@material-ui/core";
import { StockPriceChart } from "./StockPriceChart";
import { SideList } from "./SideList";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import moment from "moment";
import _ from "lodash";

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
  container: {
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
  chartContainer: {
    position: "relative"
  },
  chart: {
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    position: "absolute"
  }
});

interface IProps {
  entity: IEntity;
}

export const EntityPanel: React.FC<IProps> = ({ entity }) => {
  const theme = useTheme() as any;
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const classes = useStyles();

  const isOpenSideList = shouldOpenSideList(entity);

  const [tabId, setTabId] = useState(0);

  const [timeRange, setTimeRange] = React.useState(0);

  let notBefore = getNotBefore(timeRange);

  // let chartContainerRef: any;

  // const [size, setSize] = useState(window.innerWidth);
  // const handleResize = _.debounce(() => {
  //   setSize(chartContainerRef.width);
  // }, 166);

  return (
    <>
      {isMediumScreen && (
        <Grid
          container
          justify="center"
          spacing={1}
          className={classes.container}
        >
          {/* chart */}
          <Grid
            item
            container
            direction="column"
            md={isOpenSideList ? 9 : 12}
            lg={isOpenSideList ? 8 : 10}
          >
            <Grid item xs={12} className={classes.chartContainer}>
              <StockPriceChart
                entity={entity}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                notBefore={notBefore}
                className={classes.chart}
              />
            </Grid>
          </Grid>
          {isOpenSideList && (
            <Grid item container direction="column" md={3} lg={2}>
              <SideList entity={entity} notBefore={notBefore} />
            </Grid>
          )}
        </Grid>
      )}
      {!isMediumScreen && (
        <Grid container direction="column" className={classes.container}>
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
          <Grid item container className={`${classes.growUpContainer} ${classes.chartContainer}`}>
            {tabId === 0 && (
              <StockPriceChart
                entity={entity}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                notBefore={notBefore}
                className={classes.chart}
              />
            )}
            {isOpenSideList && tabId === 1 && (
              <SideList entity={entity} notBefore={notBefore} />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};
