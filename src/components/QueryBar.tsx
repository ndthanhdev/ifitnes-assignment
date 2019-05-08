import React from "react";
import { InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";
import { updateInput } from "../store/actions";
import _ from "lodash";

const useStyles = makeStyles({
  root: {
    display: "flex"
  },
  inputBase: {
    flex: 1,
    marginLeft: "0.5rem",
    height: "3rem"
  },
  input: {
    textTransform: "uppercase"
  },
  iconButton: {
    padding: "0.5rem"
  }
});

export const QueryBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const debounceDispatch = _.debounce(dispatch, 500);

  return (
    <Paper className={classes.root}>
      <InputBase
        placeholder="Start tying your queries ..."
        className={classes.inputBase}
        onChange={e => debounceDispatch(updateInput(e.target.value))}
        inputProps={{ className: classes.input }}
      />
    </Paper>
  );
};
