import React, { useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { useTheme } from "@mui/joy";

export function CustomSlider(props) {
  const {
    entityName,
    reverse,
    values,
    min,
    max,
    thresholdMarks,
    thresholdMarksTitles,
    style,
    suffix,
    ...rest
  } = props;

  var theme = useTheme();

  const [value, setValue] = useState(
    reverse ? values?.map((val) => -val) : values
  );
  const [marks, setMarks] = useState(
    reverse ? thresholdMarks?.map((val) => -val) : thresholdMarks
  );
  const [perc, setPerc] = useState(
    reverse
    //@ts-ignore
      ? values?.map((val) => parseInt((1 - Math.abs(val / max)) * 100))
      : values?.map((val) => (val / max) * 100)
  );

  const onChangeCustom = (e, tValues) => {
    const [minVal, maxVal] = tValues;
    if (maxVal > minVal && maxVal !== minVal) {
      setValue(tValues);
      if (!reverse) {
        setMarks([
          //@ts-ignore
          parseInt((min + minVal) / 2, 10),
          //@ts-ignore
          parseInt((minVal + maxVal) / 2, 10),
          //@ts-ignore
          parseInt((maxVal + max) / 2, 10)
        ]);
        setPerc(tValues.map((val) => (val / max) * 100));
      } else {
        setMarks([
          //@ts-ignore
          parseInt((-max + minVal) / 2, 10),
          //@ts-ignore
          parseInt((minVal + maxVal) / 2, 10),
          //@ts-ignore
          parseInt((maxVal + -min) / 2, 10)
        ]);
        setPerc(
          //@ts-ignore
          tValues.map((val) => parseInt((1 - Math.abs(val / max)) * 100))
        );
      }
    }
  };

  return (
    <Box>
      <Typography
        id="discrete-slider"
        gutterBottom
        sx={{
          marginBottom: "40px"
        }}
      >
        {entityName}
      </Typography>
      <Slider
        sx={{
            "& .MuiSlider-track": {
            //   background: `linear-gradient(to right, red 0%, red ${perc[0]}%, yellow ${perc[0]}%, yellow ${perc[1]}%, green ${perc[1]}%, green ${perc[2]}%, yellow ${perc[2]}%, yellow ${perc[3]}%, red ${perc[3]}%, red 100%)`,
              borderColor: "white"
            },
            "& .MuiSlider-thumb": {
              background: "white",
              "&:nth-of-type(1)": {
                //@ts-ignore
                background: theme.palette.error.main
              },
              "&:nth-of-type(2)": {
                //@ts-ignore
                background: theme.palette.warning.main
              },
              "&:nth-of-type(3)": {
                //@ts-ignore
                background: theme.palette.success.main
              },
              "&:nth-of-type(4)": {
                //@ts-ignore
                background: theme.palette.warning.main
              }
            },
            "& .MuiSlider-rail": {
              opacity: 0.9,
              //@ts-ignore
              background: `linear-gradient(to right, ${theme.palette.error.main} 0%, ${theme.palette.error.main} ${perc[0]}%, ${theme.palette.warning.main} ${perc[0]}%, ${theme.palette.warning.main} ${perc[1]}%, ${theme.palette.success.main} ${perc[1]}%, ${theme.palette.success.main} ${perc[2]}%, ${theme.palette.warning.main} ${perc[2]}%, ${theme.palette.warning.main} ${perc[3]}%, ${theme.palette.error.main} ${perc[3]}%, ${theme.palette.error.main} 100%)`
            },
            ...style
          }}
        valueLabelDisplay="on"
        valueLabelFormat={(x) => `${x} ${suffix || ""}`}
        value={value}
        min={reverse ? -max : min}
        max={reverse ? -min : max}
        scale={(x) => (reverse ? -x : x)}
         track={false}
        marks={marks ? [
          { value: reverse ? -max : min, label: reverse ? max : min },
          ...thresholdMarks?.map((val, idx) => ({
            // value: (val + value[idx-1]) / 2,
            value: value[idx],
            label: thresholdMarksTitles[idx]
          })),
          { value: reverse ? -min : max, label: reverse ? min : max }
        ] : []}
        onChange={(e,v) => {
            onChangeCustom(e,v);
            props.onChangeCallback(e,v);
        }}
        {...rest}
      />
    </Box>
  );
}

// Usage example for temperature and humidity sliders
const SensorConfig = () => {
  const temperatureMarks = [10, 20, 30];
  const temperatureMarkTitles = ["Low", "Medium", "High"];
  const humidityMarks = [30, 60, 90];
  const humidityMarkTitles = ["Dry", "Comfort", "Humid"];

  return (
    <Box>
      <CustomSlider
        entityName="Temperature"
        values={[10, 30]}
        min={0}
        max={50}
        thresholdMarks={temperatureMarks}
        thresholdMarksTitles={temperatureMarkTitles}
        suffix="°C"
      />
      <CustomSlider
        entityName="Humidity"
        values={[30, 90]}
        min={0}
        max={100}
        thresholdMarks={humidityMarks}
        thresholdMarksTitles={humidityMarkTitles}
        suffix="%"
      />
    </Box>
  );
};

export default SensorConfig;
