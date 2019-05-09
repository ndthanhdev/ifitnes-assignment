import React, { useState } from 'react'
import {
  Stepper,
  Step,
  StepContent,
  Typography,
  StepButton,
  Paper,
  Grid,
  makeStyles,
} from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles({
  content: {
    // height: "24rem"
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
})

export const Tutorial: React.FC = () => {
  const steps: {
    label: string
    content: string
    image: string
  }[] = [
    {
      label: 'Simple ticker query',
      content: 'FB',
      image: 'images/tut-1.png',
    },
    {
      label: 'Multiple ticker queries',
      content: 'FB MSFT TSLA',
      image: 'images/tut-2.png',
    },
    {
      label: 'Reference line and Operators',
      content: 'FB 160 MSFT < 70 TSLA > 310',
      image: 'images/tut-3.png',
    },
    {
      label: 'Everything works together',
      content: 'FB 160 + MSFT < 70 + TSLA',
      image: 'images/tut-4.png',
    },
  ]

  const classes = useStyles()
  const theme = useTheme() as any
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'))

  const [activeStep, setActiveStep] = useState(0)
  const handleStepChange = (step: number) => () => {
    setActiveStep(step)
  }

  return (
    <Paper>
      <Grid container direction="column">
        <Grid item>
          <Stepper
            activeStep={activeStep}
            nonLinear
            orientation={isMediumScreen ? 'horizontal' : 'vertical'}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepButton onClick={handleStepChange(index)}>
                  {step.label}
                </StepButton>
                {!isMediumScreen && (
                  <StepContent>
                    <Grid
                      item
                      container
                      justify="center"
                      className={classes.content}
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="h6">
                          {`"${steps[activeStep].content}"`}
                        </Typography>
                        <br />
                      </Grid>
                      {/* <Grid item>
                        <img
                          alt={`${steps[activeStep].content}`}
                          src={steps[activeStep].image}
                          className={classes.image}
                        />
                      </Grid> */}
                    </Grid>
                  </StepContent>
                )}
              </Step>
            ))}
          </Stepper>
        </Grid>
        {isMediumScreen && (
          <Grid
            item
            container
            justify="center"
            className={classes.content}
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h6">
                {`"${steps[activeStep].content}"`}
              </Typography>
              <br />
            </Grid>
            {/* <Grid item>
              <img
                alt={`${steps[activeStep].content}`}
                src={steps[activeStep].image}
                className={classes.image}
              />
            </Grid> */}
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}
