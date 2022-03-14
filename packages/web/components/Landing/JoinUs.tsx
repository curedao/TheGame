import { Box, Button, Container, HStack, Text, VStack } from '@metafam/ds';
import BackgroundImage from 'assets/landing/just-watch-background.png';
import { FullPageContainer } from 'components/Container';
import { StartButton } from 'components/Landing/StartButton';
import { MetaLink } from 'components/Link';
import { useOnScreen } from 'lib/hooks/useOnScreen';
import { useRef } from 'react';
import { BsArrowRight } from 'react-icons/bs';

import { LandingFooter } from './LandingFooter';

export const JoinUs: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const section = 'join-us';

  return (
    <FullPageContainer
      bgImageUrl={BackgroundImage}
      id={section}
      position="relative"
      justify={{ base: 'center', md: 'flex-end' }}
    >
      <Container
        d="flex"
        maxW={{ base: '100%', md: '7xl' }}
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          ref={ref}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          maxWidth={{ base: '100%', md: '2xl' }}
          pl={{ base: 0, md: 0 }}
          textAlign="center"
          zIndex={1}
          transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
          opacity={onScreen ? 1 : 0}
          transition="transform 0.3s 0.1s ease-in-out, opacity 0.5s 0.2s ease-in"
        >
          <VStack>
            <Text
              fontSize={{ base: '4xl', md: '6xl' }}
              lineHeight={{ base: '2.5rem', md: '3rem' }}
              fontWeight="700"
              color="white"
              mb="2.188rem"
            >
              The revolution will be televized, but{' '}
              <Text
                as="span"
                className="gradient-text"
                opacity={onScreen ? 1 : 0}
                transition="opacity 0.5s 0.6s ease-in"
              >
                don’t just watch.
              </Text>
            </Text>
            <HStack
              opacity={onScreen ? 1 : 0}
              transition="transform 0.3s 0.1s ease-in-out, opacity 0.5s 1s ease-in"
            >
              <StartButton text="Enter here" />
              <MetaLink
                _hover={{}}
                isExternal
                href="https://wiki.metagame.wtf/docs/"
              >
                <Button
                  colorScheme="white"
                  size="lg"
                  rightIcon={<BsArrowRight />}
                >
                  Explore more
                </Button>
              </MetaLink>
            </HStack>
          </VStack>
        </Box>
      </Container>
      <LandingFooter />
    </FullPageContainer>
  );
};