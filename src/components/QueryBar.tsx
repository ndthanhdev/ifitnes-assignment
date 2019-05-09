import React from 'react'
import { InputBase, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import _ from 'lodash'

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  inputBase: {
    flex: 1,
    marginLeft: '0.5rem',
    height: '3rem',
  },
  input: {
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: '0.5rem',
  },
})

export const QueryBar: React.FC<{
  onChange?: (value: string) => any
}> = ({ onChange = () => {} }) => {
  const classes = useStyles()
  const handleChange = _.debounce(onChange, 500)

  return (
    <Paper className={classes.root}>
      <InputBase
        placeholder="Start typing your queries ..."
        className={classes.inputBase}
        onChange={e => handleChange(e.target.value)}
        inputProps={{ className: classes.input }}
      />
    </Paper>
  )
}
