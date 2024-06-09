import { useController } from 'react-hook-form';
import { Button, InputLabel, TextField } from '@mui/material';
import { makeStyles } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

export default function SSHFileInput(props) {
  const classes = useStyles();
  const {
    name,
    control,
    rules,
    label,
  } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };

  return (
    <div>
      <InputLabel>{label}</InputLabel>
      <TextField
        type="text"
        value={value ? value.name : ''}
        error={invalid}
        helperText={error ? error.message : ''}
        InputProps={{
          readOnly: true,
        }}
      />
      <input
        id={`file-upload-${name}`}
        name={name}
        type="file"
        accept=".pem,.key"
        onChange={handleFileChange}
        onBlur={onBlur}
        className={classes.input}
      />
      <label htmlFor={`file-upload-${name}`}>
        <Button
          variant="contained"
          component="span"
          className={classes.button}
        >
          Upload
        </Button>
      </label>
    </div>
  );
}