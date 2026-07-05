import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { ITextFieldFormProps } from './ITextFieldForm';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export function TextFieldPasswordForm<T>({ name, control, label, ...props }: ITextFieldFormProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...props}
          {...field}
          label={label}
          error={!!error}
          helperText={error ? error.message : null}
          type={!showPassword ? 'password' : 'text'}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }}
        />
      )}
    />
  );
}

