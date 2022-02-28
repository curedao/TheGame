import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  MetaButton,
  MetaHeading,
  Spinner,
  StatusedSubmitButton,
  Text,
  useToast,
  Wrap,
  WrapItem,
} from '@metafam/ds';
import { Maybe, Optional } from '@metafam/utils';
import { FlexContainer } from 'components/Container';
import { HeadComponent } from 'components/Seo';
import { useSetupFlow } from 'contexts/SetupContext';
import { CeramicError, useWeb3 } from 'lib/hooks';
import {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Control, useForm, UseFormRegisterReturn } from 'react-hook-form';

export type MaybeModalProps = {
  buttonLabel?: string | ReactElement;
  onClose?: () => void;
};

export type WizardPaneProps = {
  field: string;
  title?: string | ReactElement;
  prompt?: string | ReactElement;
  buttonLabel?: string | ReactElement;
  onClose?: () => void;
};

export type PaneProps<T = string> = WizardPaneProps & {
  value: Optional<Maybe<T>>;
  fetching?: boolean;
  authenticating?: boolean;
  onSave?: ({
    values,
    setStatus,
  }: {
    values: Record<string, unknown>;
    setStatus?: (msg: string) => void;
  }) => Promise<void>;
};

export type WizardPaneCallbackProps<T = string> = {
  register: (
    field: string,
    opts: Record<string, unknown>,
  ) => UseFormRegisterReturn;
  control: Control;
  loading: boolean;
  errored: boolean;
  dirty: boolean;
  current: T;
  setter: (arg: T | ((prev: Optional<Maybe<T>>) => Maybe<T>)) => void;
};

export const WizardPane = <T,>({
  field,
  title,
  prompt,
  buttonLabel,
  onClose,
  onSave,
  value: existing,
  fetching = false,
  children,
}: PropsWithChildren<PaneProps<T>>) => {
  const { onNextPress, nextButtonLabel } = useSetupFlow();
  const [status, setStatus] = useState<Maybe<string | ReactElement>>();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValidating: validating, dirtyFields },
  } = useForm();
  const current = watch(field, existing);
  const dirty = current !== existing || dirtyFields[field];
  const { connecting, connected, connect } = useWeb3();
  const toast = useToast();

  useEffect(() => {
    setValue(field, existing);
  }, [existing, field, setValue]);

  const onSubmit = useCallback(
    async (values) => {
      try {
        if (!dirty) {
          setStatus('No Change. Skipping Save…');
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
        } else if (onSave) {
          setStatus('Saving…');
          await onSave({ values, setStatus });
        }

        (onClose ?? onNextPress).call(this);
      } catch (err) {
        const heading = err instanceof CeramicError ? 'Ceramic Error' : 'Error';
        toast({
          title: heading,
          description: (err as Error).message,
          status: 'error',
          isClosable: true,
          duration: 12000,
        });
        setStatus(null);
      }
    },
    [dirty, onClose, onNextPress, onSave, toast],
  );

  const setter = useCallback(
    (val: unknown) => {
      let next = val;
      if (val instanceof Function) {
        next = val(current);
      }
      setValue(field, next);
    },
    [current, field, setValue],
  );

  if (!connecting && !connected) {
    return <MetaButton onClick={connect}>Connect To Progress</MetaButton>;
  }

  return (
    <FlexContainer as="form" onSubmit={handleSubmit(onSubmit)} color="white">
      <HeadComponent title={`MetaGame: Setting ${title}`} />
      {title && (
        <MetaHeading mt={8} mb={1} textAlign="center">
          {title}
        </MetaHeading>
      )}
      {prompt && (
        <Box maxW="25rem">
          {typeof prompt === 'string' ? (
            <Text mb={0} textAlign="center">
              {prompt}
            </Text>
          ) : (
            prompt
          )}
        </Box>
      )}
      <FormControl
        isInvalid={!!errors[field]}
        isDisabled={!connected || fetching}
      >
        {(!connected || fetching || validating) && (
          <Flex justify="center" align="center" my={8}>
            <Spinner thickness="4px" speed="1.25s" size="lg" mr={4} />
            <Text>
              {(() => {
                if (!connected) return 'Authenticating…';
                if (validating) return 'Validating…';
                return 'Loading Current Value…';
              })()}
            </Text>
          </Flex>
        )}
        <Box my={5}>
          {typeof children === 'function'
            ? children.call(null, {
                register,
                control,
                loading: !connected || fetching,
                errored: !!errors[field],
                dirty,
                current,
                setter,
              })
            : children}
          <FormErrorMessage style={{ justifyContent: 'center' }}>
            {errors[field]?.message}
          </FormErrorMessage>
        </Box>
      </FormControl>

      <Wrap align="center">
        <WrapItem>
          <StatusedSubmitButton
            label={buttonLabel ?? nextButtonLabel}
            {...{ status }}
          />
        </WrapItem>
        {onClose && (
          <WrapItem>
            <Button
              variant="ghost"
              onClick={onClose}
              color="white"
              _hover={{ bg: '#FFFFFF11' }}
              _active={{ bg: '#FF000011' }}
            >
              Close
            </Button>
          </WrapItem>
        )}
      </Wrap>
    </FlexContainer>
  );
};
