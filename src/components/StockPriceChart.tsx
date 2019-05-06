import React from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  ReferenceLine
} from "recharts";
import {
  Typography,
  Tab,
  Tabs,
  makeStyles,
  Paper,
  Grid,
  CircularProgress
} from "@material-ui/core";
import { useSelector } from "react-redux";
import _ from "lodash";
import randomcolor from "randomcolor";
import { IPrice, IStockPrice } from "../interfaces/StockPrice";
import { IState, IStockPriceMap } from "../store/reducer";
import moment, { Moment } from "moment";
import { IEntity, ITickerEntity } from "../interfaces/Entity";
import { IVisualTicker } from "../interfaces/VisualTicker";

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

function createVisualTicker(
  tickerEntities: ITickerEntity[],
  stockPrices: IStockPriceMap,
  notBefore: Moment
) {
  return tickerEntities.map((tickerEntity, index) => {

    let result = {
      tickerSymbol: tickerEntity.tickerSymbol,
      operator: tickerEntity.operator,
      base: tickerEntity.base,
      isLoading: true,
      prices: [],
      color: randomcolor({ seed: tickerEntity.tickerSymbol})
    } as IVisualTicker;

    const stockPrice = stockPrices[tickerEntity.tickerSymbol];

    if (stockPrice) {
      result.error = stockPrice.error;
      if (stockPrice.error || stockPrice.name) result.isLoading = false;
      if (stockPrice.prices)
        result.prices = stockPrice.prices
          .filter(price => notBefore.isBefore(price.date))
          .map(({ date, close }) => ({
            date,
            [tickerEntity.tickerSymbol]: close
          }));
    }

    return result;
  });
}

function createPrices(tickers: IVisualTicker[]) {
  let merged = _.mergeWith([], ...tickers.map(vTicker => vTicker.prices));

  return Object.keys(merged).map(k => ({
    date: k,
    ...merged[k]
  }));
}

const useStockPrices = () => {
  return useSelector((state: IState) => state.stockPriceMap);
};

const useStyles = makeStyles({
  tabRange: {
    height: "2rem"
  },
  grid: {
    height: "20rem"
  },
  chartContainer: {
    "flex-grow": 1
  }
});

interface IProps {
  entity: IEntity;
}

export const StockPriceChart: React.FC<IProps> = ({ entity }) => {
  function handleTabChange(event: any, newValue: any) {
    setRange(newValue);
  }
  const stockPrices = useStockPrices();

  let tickerEntities: ITickerEntity[] = [];

  if (entity.type === "TickerEntity") {
    tickerEntities.push(entity);
  } else if (entity.type === "Combination") {
    tickerEntities.push(...entity.queries);
  }

  const title = tickerEntities.map(entity => entity.tickerSymbol).join(" | ");

  const [range, setRange] = React.useState(0);
  let notBefore = getNotBefore(range);

  const visualTickers = createVisualTicker(
    tickerEntities,
    stockPrices,
    notBefore
  );

  const classes = useStyles();

  let isLoading = visualTickers.some(vTicker => vTicker.isLoading);

  let errorMessage = visualTickers.find(vTicker => Boolean(vTicker.error));

  let prices = !isLoading && !errorMessage ? createPrices(visualTickers) : [];

  return (
    <Paper>
      <Grid container direction="column" spacing={1} className={classes.grid}>
        <Grid item>
          <Typography variant="h6" color="primary" align="center">
            {title}
          </Typography>
        </Grid>
        <Grid
          item
          container
          className={classes.chartContainer}
          justify="center"
          alignItems="center"
        >
          {!(isLoading || errorMessage) && (
            <ResponsiveContainer>
              <AreaChart data={prices}>
                <defs>
                  {visualTickers.map(vTicker => (
                    <linearGradient
                      key={vTicker.tickerSymbol}
                      id={vTicker.tickerSymbol}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={vTicker.color}
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="80%"
                        stopColor={vTicker.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                {visualTickers.map(vTicker => (
                  <Area
                    key={vTicker.tickerSymbol}
                    type="monotone"
                    dataKey={vTicker.tickerSymbol}
                    stroke={vTicker.color}
                    fillOpacity={1}
                    fill={`url(#${vTicker.tickerSymbol})`}
                  />
                ))}
                {visualTickers.map(vTicker => {
                  return (
                    vTicker.base !== undefined && (
                      <ReferenceLine
                        key={vTicker.tickerSymbol}
                        y={vTicker.base}
                        stroke={vTicker.color}
                        label={`${vTicker.base}`}
                        strokeDasharray="3 3"
                      />
                    )
                  );
                })}
                <XAxis dataKey="date" reversed />
                <YAxis />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {isLoading && <CircularProgress />}
          {errorMessage && (
            <Typography variant="h5" color="textSecondary">
              {errorMessage}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <Tabs
            value={range}
            onChange={handleTabChange}
            scrollButtons="auto"
            variant="scrollable"
          >
            <Tab label="1 week" />
            <Tab label="1 month" />
            <Tab label="3 months" />
            <Tab label="6 months" />
            <Tab label="1 year" />
            <Tab label="5 years" />
            <Tab label="All" />
          </Tabs>
        </Grid>
      </Grid>
    </Paper>
  );
};
