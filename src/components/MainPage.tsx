import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { QueryBar } from './QueryBar'
import { makeStyles } from '@material-ui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { IState } from '../store/reducer'
import { EntityPanel } from './EntityPanel'
import { Tutorial } from './Tutorial'
import CssBaseline from '@material-ui/core/CssBaseline'
import { updateInput } from '../store/actions'

const useEntities = () => {
  return useSelector((state: IState) => state.entities)
}

const useParserMessage = () => {
  return useSelector((state: IState) => state.parserMessage)
}

const useStyles = makeStyles({
  root: {
    padding: '1rem 0.5rem',
  },
  entityPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  entityPanelContainer: {
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  parserMessageContainer: {
    height: '20rem',
  },
})

export const MainPage: React.FC = () => {
  const classes = useStyles()
  const entities = useEntities()
  const parserMessage = useParserMessage()
  const dispatch = useDispatch()

  return (
    <div>
      <CssBaseline />
      <Grid container className={classes.root} spacing={3} direction="column">
        <Grid item container className={classes.fullWidth} justify="center">
          <Grid item xs={12} lg={10}>
            <QueryBar onChange={query => dispatch(updateInput(query))} />
          </Grid>
        </Grid>
        <Grid item container spacing={2} alignItems="center" direction="column">
          {entities.map((entity, index) => {
            return (
              <Grid container item key={index} className={classes.fullWidth}>
                <Grid item xs={12}>
                  <EntityPanel entity={entity} />
                </Grid>
              </Grid>
            )
          })}
          {!parserMessage && entities.length === 0 && (
            <Grid item xs={12} lg={10} className={classes.fullWidth}>
              <Tutorial />
            </Grid>
          )}
          {parserMessage && (
            <Grid item container justify="center" alignItems="center">
              <Grid item className={classes.parserMessageContainer}>
                <Typography>{parserMessage}</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  )
}
