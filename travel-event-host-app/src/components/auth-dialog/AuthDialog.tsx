'use client';

import { RuleValidator } from '@/lib/validators/rule-validator/rule-validator';
import { EmptyNullStringRule } from '@/lib/validators/rules/empty-null-string-rule';
import { MatchingPasswordsRule } from '@/lib/validators/rules/matching-passwords-rule';
import { PasswordComplexityRule } from '@/lib/validators/rules/password-complexity-rule';
import { ValidEmailRule } from '@/lib/validators/rules/valid-email-rule';
import { ValidNameRule } from '@/lib/validators/rules/valid-name-rule';
import { clientSignIn } from '@/app/clients/user/auth-client';
import { clientSignUp } from '@/app/clients/user/auth-client';

import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { ChangeEventHandler, useState } from 'react';
import { SignupFields } from './SignupFields/SignupFields';
import { LoginFields } from './login-fields/LoginFields';

/**
 * Dialog used for signup and login
 */

interface AuthDialogProps {
  open: boolean;
  onDialogClose: () => void;
  authDialogType: 'login' | 'signup';
  onRegisterSuccess?: () => void;
}

export default function AuthDialog(props: AuthDialogProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const theme = useTheme();

  const handleSubmit = () => {
    // Validate the signup form
    if (props.authDialogType === 'signup') {
      const signupValidationResult: Record<string, string[]> = validateSignUp();
      if (Object.keys(signupValidationResult).length > 0) {
        setErrors(signupValidationResult);
        return;
      }
      // TODO: submit the form
      const fetchSignUp = async () => {
        const signUpRes = await clientSignUp(
          formValues.name,
          formValues.email,
          formValues.password1,
        );

        if (signUpRes) {
          if (signUpRes === true) {
            setErrors({});
            props.onDialogClose();
            props.onRegisterSuccess;
          } else {
            setErrors(signUpRes as Record<string, string[]>);
          }
        }
      };
      fetchSignUp();
      return;
    } else {
      // Validate the login form
      const loginValidationResult: Record<string, string[]> = validateLogin();
      if (Object.keys(loginValidationResult).length > 0) {
        console.log(loginValidationResult);
        setErrors(loginValidationResult);
        return;
      }
      const fetchSignIn = async () => {
        const signInRes = await clientSignIn(formValues.email, formValues.password1);
        if (signInRes) {
          if (signInRes === true) {
            window.location.reload();
          } else {
            setErrors(signInRes as Record<string, string[]>);
          }
        }
      };
      fetchSignIn();
      // TODO: submit the form
    }
  };

  const handleFormValueChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateSignUp = (): Record<string, string[]> => {
    // Validate the fields before submitting
    const emailAddressValidator: RuleValidator = new RuleValidator([
      new EmptyNullStringRule('email'),
      new ValidEmailRule('email'),
    ]);

    const nameValidator: RuleValidator = new RuleValidator([
      new EmptyNullStringRule('name'),
      new ValidNameRule('name'),
    ]);

    const firstPasswordValidator: RuleValidator = new RuleValidator([
      new EmptyNullStringRule('password1', 'Password field cannot be empty'),
      new PasswordComplexityRule('password1'),
    ]);

    const secondPasswordValidator: RuleValidator = new RuleValidator([
      new MatchingPasswordsRule('password2'),
    ]);

    return {
      ...emailAddressValidator.validate(formValues.email),
      ...nameValidator.validate(formValues.name),
      ...firstPasswordValidator.validate([formValues.password1, formValues.password2]),
      ...secondPasswordValidator.validate([formValues.password1, formValues.password2]),
    };
  };

  const validateLogin = (): Record<string, string[]> => {
    // Validate the fields before submitting
    const emailAddressValidator: RuleValidator = new RuleValidator([
      new EmptyNullStringRule('email'),
      new ValidEmailRule('email'),
    ]);

    const passwordValidator: RuleValidator = new RuleValidator([
      new EmptyNullStringRule('password1', 'Password field cannot be empty'),
    ]);

    return {
      ...emailAddressValidator.validate(formValues.email),
      ...passwordValidator.validate(formValues.password1),
    };
  };

  return (
    <Dialog
      open={props.open}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: theme.palette.primary.secondaryColorDarkBlack,
          width: '100%',
        },
        [theme.breakpoints.down(430)]: {
          '& .MuiPaper-root': {
            margin: 0,
          },
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.primary.secondaryColorDarkBlack }}>
        <Box>
          <Box display='flex' justifyContent={'flex-end'}>
            <IconButton onClick={() => props.onDialogClose()}>
              <CloseIcon sx={{ color: theme.palette.primary.thirdColorIceLight }} />
            </IconButton>
          </Box>
          <Box mt={3}>
            <Box>{/* App logo goes here */}</Box>
            <Box>
              <Typography
                variant='h4'
                color={theme.palette.primary.thirdColorIceLight}
                sx={{ fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}
              >
                {props.authDialogType === 'signup' ? 'Sign Up' : 'Log in'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>
      <Box
        ml={'1.5rem'}
        mr={'1.5rem'}
        sx={{
          [theme.breakpoints.down(430)]: {
            marginLeft: '2px',
            marginRight: '2px',
            padding: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            backgroundColor: theme.palette.primary.secondaryColorDarkBlack,
            [theme.breakpoints.down(430)]: {
              padding: '1px',
            },
          }}
        >
          <Box
            className='providerAuthSection'
            display='flex'
            flexDirection={'column'}
            mb={5}
            mt={5}
          >
            <Box alignSelf={'center'} mb={2}>
              {/* Google sign up button */}
              <Button
                variant='outlined'
                startIcon={<GoogleIcon />}
                sx={{
                  '&.MuiButtonBase-root': {
                    color: theme.palette.primary.thirdColorIceLight,
                    borderColor: theme.palette.primary.thirdColorIceLight,
                  },
                }}
              >
                {' '}
                Continue with Google{' '}
              </Button>
            </Box>

            <Box alignSelf={'center'}>
              {/* Github sign up button */}
              <Button
                variant='outlined'
                startIcon={<GitHubIcon />}
                sx={{
                  '&.MuiButtonBase-root': {
                    color: theme.palette.primary.thirdColorIceLight,
                    borderColor: theme.palette.primary.thirdColorIceLight,
                  },
                }}
              >
                {' '}
                Continue with Github{' '}
              </Button>
            </Box>
          </Box>
          <Divider
            sx={{
              marginBottom: 3,
              '&.MuiDivider-root::before': {
                borderColor: theme.palette.primary.thirdColorlightBlack,
              },
              '&.MuiDivider-root::after': {
                borderColor: theme.palette.primary.thirdColorlightBlack,
              },
            }}
          >
            <Chip
              label='OR'
              size='small'
              sx={{
                '&.MuiChip-root': {
                  backgroundColor: theme.palette.primary.thirdColorlightBlack,
                  color: theme.palette.primary.thirdColorIceLight,
                  opacity: 0.5,
                },
              }}
            />
          </Divider>
          <form>{renderFormFields(props.authDialogType, handleFormValueChanged, errors)}</form>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: theme.palette.primary.secondaryColorDarkBlack,
            display: 'block',
            marginBottom: 3,
          }}
        >
          <Box
            display='flex'
            justifyContent={'space-around'}
            sx={{
              [theme.breakpoints.down(430)]: {
                flexDirection: 'column',
              },
            }}
          >
            <Box>
              <StyledButton
                variant={'contained'}
                size={'large'}
                sx={{ marginBottom: '1rem' }}
                onClick={handleSubmit}
              >
                {props.authDialogType === 'signup' ? 'Sign Up' : 'Log in'}
              </StyledButton>
            </Box>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function renderFormFields(
  authDialogType: 'login' | 'signup',
  handleValueChanged: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined,
  errors: Record<string, string[]>,
) {
  if (authDialogType === 'signup') {
    return SignupFields(handleValueChanged, errors);
  }
  return LoginFields(handleValueChanged, errors);
}

const StyledButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down(430)]: {
    width: '100%',
  },
}));
