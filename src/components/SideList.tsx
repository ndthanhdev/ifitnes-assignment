import React from "react";
import {
  AutoSizer,
  Table,
  Column,
} from "react-virtualized";
import {
  makeStyles,
  TableCell,
  Paper,
  Tabs,
  Tab,
  Grid
} from "@material-ui/core";
import { IEntity, ITickerEntity } from "../interfaces/Entity";
import { useStockPrices } from "./StockPriceChart";
import { TableCellProps } from "@material-ui/core/TableCell";
import { Moment } from "moment";

function createTabs(entity: IEntity) {
  if (entity.type === "TickerEntity") {
    return entity.base !== undefined ? [entity.tickerSymbol] : [];
  } else if (entity.type === "Combination") {
    return entity.queries
      .filter(query => query.tickerSymbol && Boolean(query.base))
      .map(query => query.tickerSymbol);
  }

  return [];
}

function getTickerEntity(entity: IEntity, index: number) {
  if (entity.type === "TickerEntity") {
    return entity;
  } else if (entity.type === "Combination") {
    return entity.queries[index];
  }
}

function useRows(notBefore: Moment, entity?: ITickerEntity) {
  const stockPricesMap = useStockPrices();

  if (!entity) {
    return [];
  }

  if (stockPricesMap[entity.tickerSymbol]) {
    const prices = (stockPricesMap[entity.tickerSymbol].prices || []).filter(
      price => notBefore.isBefore(price.date)
    );

    const base = entity.base;
    if (base) {
      if (entity.operator === ">") {
        return (prices || []).filter(price => price.close > base);
      } else if (entity.operator === "<") {
        return (prices || []).filter(price => price.close < base);
      }
    }
    return prices;
  }

  return [];
}

const useStyles = makeStyles({
  flexContainer: {
    display: "flex"
    // alignItems: "center",
    // boxSizing: "border-box"
  },
  growUpContainer: {
    // height: "24rem",
    flexGrow: 1
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
  gridContainer: {
    height: "100%"
  },
  tableCell: {
    flex: 1
  }
});

interface IProps {
  entity: IEntity;
  notBefore: Moment;
}

export const SideList: React.FC<IProps> = ({ entity, notBefore }) => {
  const classes = useStyles();

  const headerRenderer: React.FC<IHeaderRendererProps> = ({ label, align }) => {
    return (
      <TableCell
        component="div"
        variant="head"
        align={align}
        className={`${classes.tableCell} ${classes.flexContainer}`}
      >
        {label}
      </TableCell>
    );
  };

  const cellRenderer: React.FC<ICellRendererProps> = ({
    cellData,
    columnIndex
  }) => {
    const align = columnIndex === 0 ? "left" : "right";

    return (
      <TableCell
        component="div"
        variant="body"
        align={align}
        className={classes.tableCell}
      >
        {cellData}
      </TableCell>
    );
  };

  const rowHeight = 48;
  const headerHeight = 48;

  const tabs = createTabs(entity);
  const [tabIndex, setTabIndex] = React.useState(0);
  function handleTabChange(event: any, newValue: any) {
    setTabIndex(newValue);
  }

  const tickerEntity = getTickerEntity(entity, tabIndex);

  const rows = useRows(notBefore, tickerEntity);

  return (
    <Paper className={`${classes.growUpContainer}`}>
      <Grid container direction="column" className={classes.gridContainer}>
        <Grid item>
          {tabs.length > 1 && (
            <div className={classes.tabWrapperParent}>
              <div className={classes.tabWrapper}>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  {tabs.map((tab, index) => (
                    <Tab label={tab} key={index} />
                  ))}
                </Tabs>
              </div>
            </div>
          )}
        </Grid>
        <Grid item className={classes.growUpContainer}>
          <AutoSizer className={classes.growUpContainer}>
            {autoSizerChildProps => (
              <Table
                {...autoSizerChildProps}
                rowHeight={rowHeight}
                rowCount={rows.length}
                headerHeight={headerHeight}
                rowGetter={({ index }) => rows[index]}
                rowClassName={classes.flexContainer}
                height={autoSizerChildProps.height}
                width={autoSizerChildProps.width}
              >
                <Column
                  dataKey={"date"}
                  width={0}
                  flexGrow={120}
                  className={classes.flexContainer}
                  headerRenderer={() =>
                    headerRenderer({
                      label: "Date",
                      align: "left"
                    })
                  }
                  cellRenderer={({ cellData, columnIndex }) =>
                    cellRenderer({ cellData, columnIndex })
                  }
                />
                <Column
                  dataKey={"close"}
                  flexGrow={1}
                  width={120}
                  className={classes.flexContainer}
                  headerRenderer={() =>
                    headerRenderer({
                      label: "Close price",
                      align: "right"
                    })
                  }
                  cellRenderer={({ cellData, columnIndex }) =>
                    cellRenderer({ cellData, columnIndex })
                  }
                />
              </Table>
            )}
          </AutoSizer>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface IHeaderRendererProps extends Pick<TableCellProps, "align"> {
  label: string;
}

interface ICellRendererProps {
  cellData: any;
  columnIndex: number;
}
