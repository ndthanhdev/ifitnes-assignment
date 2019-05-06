import React from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area
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
import { IPrice } from "../interfaces/StockPrice";
import { IState } from "../store/reducer";
import { useSelector } from "react-redux";
import { IQuery } from "../interfaces/Query";
import moment from "moment";

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

const useStockPrice = (tickerSymbol: string) => {
  return useSelector((state: IState) => state.stockPrices.get(tickerSymbol));
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
  query: IQuery;
}

export const StockPriceChart: React.FC<IProps> = ({ query }) => {
  function handleTabChange(event: any, newValue: any) {
    setRange(newValue);
  }

  const classes = useStyles();

  const [range, setRange] = React.useState(0);

  const stockPrice = useStockPrice(query.tickerSymbol);

  let notBefore = getNotBefore(range);

  let prices: IPrice[] = [];
  if (stockPrice && stockPrice.prices) {
    prices = stockPrice.prices.filter(price => notBefore.isBefore(price.date));
  }

  let isLoading = true;
  if (stockPrice && (stockPrice.error || stockPrice.name)) {
    isLoading = false;
  }

  let errorMessage = "";
  if (stockPrice && stockPrice.error) {
    errorMessage = stockPrice.error.message;
  }

  return (
    <Paper>
      <Grid container direction="column" spacing={1} className={classes.grid}>
        <Grid item>
          <Typography variant="h6" color="primary" align="center">
            {query.tickerSymbol}
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
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
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
