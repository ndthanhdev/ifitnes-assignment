import React, { ReactNode } from "react";
import {
  AutoSizer,
  Table,
  Column,
  SortDirection,
  SortDirectionType,
  TableHeaderProps,
  TableProps
} from "react-virtualized";
import {
  makeStyles,
  TableCell,
  TableSortLabel,
  Paper,
  Tabs,
  Tab,
  Grid
} from "@material-ui/core";
import clsx from "clsx";
import { IEntity, ITickerEntity } from "../interfaces/Entity";
import { useSelector } from "react-redux";
import { IState, IStockPriceMap } from "../store/reducer";
import { useStockPrices } from "./StockPriceChart";
import { TableCellProps } from "@material-ui/core/TableCell";

function createTabs(entity: IEntity) {
  if (entity.type === "TickerEntity") {
    return [entity.tickerSymbol];
  } else if (entity.type === "Combination") {
    return entity.queries.map(query => query.tickerSymbol);
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

function useRows(entity?: ITickerEntity) {
  const stockPricesMap = useStockPrices();

  if (!entity) {
    return [];
  }

  if (stockPricesMap[entity.tickerSymbol]) {
    const prices = stockPricesMap[entity.tickerSymbol].prices || [];
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
  }
});

interface IProps {
  entity: IEntity;
}

export const SideList: React.FC<IProps> = ({ entity }) => {
  const rowHeight = 48;
  const headerHeight = 48;
  const classes = useStyles();

  const tabs = createTabs(entity);
  const [tabIndex, setTabIndex] = React.useState(0);
  function handleTabChange(event: any, newValue: any) {
    setTabIndex(newValue);
  }

  const tickerEntity = getTickerEntity(entity, tabIndex);

  const rows = useRows(tickerEntity);

  return (
    <Paper className={`${classes.growUpContainer}`}>
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
      <Grid container className={classes.growUpContainer}>
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
                width={120}
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
    </Paper>
  );
};

interface IHeaderRendererProps extends Pick<TableCellProps, "align"> {
  label: string;
}

export const headerRenderer: React.FC<IHeaderRendererProps> = ({
  label,
  align
}) => {
  return (
    <TableCell component="div" variant="head" align={align}>
      {label}
    </TableCell>
  );
};

interface ICellRendererProps {
  cellData: any;
  columnIndex: number;
}
export const cellRenderer: React.FC<ICellRendererProps> = ({
  cellData,
  columnIndex
}) => {
  const align = columnIndex === 0 ? "left" : "right";

  return (
    <TableCell component="div" variant="body" align={align}>
      {cellData}
    </TableCell>
  );
};
