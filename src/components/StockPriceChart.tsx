import React from 'react'
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts'
import {
  Typography,
  Tab,
  Tabs,
  makeStyles,
  Paper,
  Grid,
  CircularProgress,
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import randomcolor from 'randomcolor'
import { IState, IStockPricesMap } from '../store/reducer'
import { Moment } from 'moment'
import { IEntity, ITickerEntity } from '../interfaces/Entity'
import { IVisualTicker } from '../interfaces/VisualTicker'

function createVisualTicker(
  tickerEntities: ITickerEntity[],
  stockPrices: IStockPricesMap,
  notBefore: Moment
) {
  return tickerEntities.map((tickerEntity, index) => {
    let result = {
      tickerSymbol: tickerEntity.tickerSymbol,
      operator: tickerEntity.operator,
      base: tickerEntity.base,
      isLoading: true,
      prices: [],
      color: randomcolor({ seed: tickerEntity.tickerSymbol }),
    } as IVisualTicker

    const stockPrice = stockPrices[tickerEntity.tickerSymbol]

    if (stockPrice) {
      result.error = stockPrice.error
      if (stockPrice.error || stockPrice.name) result.isLoading = false
      if (stockPrice.prices)
        result.prices = stockPrice.prices
          .filter(price => notBefore.isBefore(price.date))
          .map(({ date, close }) => ({
            date,
            [tickerEntity.tickerSymbol]: close,
          }))
    }

    return result
  })
}

function createPrices(tickers: IVisualTicker[]) {
  let merged = _.mergeWith([], ...tickers.map(vTicker => vTicker.prices))

  return Object.keys(merged).map(k => ({
    date: k,
    ...merged[k],
  }))
}

function getErrorMessage(tickers: IVisualTicker[]) {
  const errorTicker = tickers.find(vTicker => Boolean(vTicker.error))

  if (errorTicker && errorTicker.error) {
    return errorTicker.error.message
  }

  return undefined
}

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  container: {
    // height: "24rem",
    flexGrow: 1,
  },
  chartContainer: {
    'flex-grow': 1,
  },
  tabWrapperParent: {
    position: 'relative',
    overflow: 'hidden',
    height: '3rem',
  },
  tabWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
})

interface IProps {
  entity: IEntity
  timeRange: number
  setTimeRange: (timeRange: number) => any
  notBefore: Moment
  stockPrices: IStockPricesMap;
  className?: string
}

export const StockPriceChart: React.FC<IProps> = ({
  entity,
  timeRange,
  setTimeRange,
  notBefore,
  stockPrices,
  className = '',
}) => {
  function handleTabChange(event: any, newValue: any) {
    setTimeRange(parseInt(newValue))
  }

  let tickerEntities: ITickerEntity[] = []

  if (entity.type === 'TickerEntity') {
    tickerEntities.push(entity)
  } else if (entity.type === 'Combination') {
    tickerEntities.push(...entity.queries)
  }

  const title = tickerEntities.map(entity => entity.tickerSymbol).join(' | ')

  const visualTickers = createVisualTicker(
    tickerEntities,
    stockPrices,
    notBefore
  )

  const classes = useStyles()

  let isLoading = visualTickers.some(vTicker => vTicker.isLoading)

  let errorMessage = getErrorMessage(visualTickers)

  let prices = !isLoading && !errorMessage ? createPrices(visualTickers) : []

  return (
    <Paper className={`${classes.flexContainer} ${className}`}>
      <Grid
        container
        direction="column"
        spacing={1}
        className={classes.container}
      >
        <Grid item>
          <Typography variant="h6" color="primary" align="center">
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <div className={classes.tabWrapperParent}>
            <div className={classes.tabWrapper}>
              <Tabs
                value={timeRange}
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
            </div>
          </div>
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
                      key={vTicker.tickerSymbol + 'gradient'}
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
                        offset="20%"
                        stopColor={vTicker.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                {visualTickers.map(vTicker => (
                  <Area
                    key={vTicker.tickerSymbol + 'area'}
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
                        key={vTicker.tickerSymbol + 'refLine'}
                        y={vTicker.base}
                        stroke={vTicker.color}
                        label={`${vTicker.base}`}
                        strokeDasharray="3 3"
                      />
                    )
                  )
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
      </Grid>
    </Paper>
  )
}
