import { HStack, Image, Text, Tooltip } from '@metafam/ds';
import { numbers } from '@metafam/utils';
import SeedMarket from 'assets/seed-icon.svg';
import XPStar from 'assets/xp-star.svg';
import { usePSeedBalance } from 'lib/hooks/balances';
import React from 'react';

const { amountToDecimal } = numbers;

// Display player XP and Seed
type Props = {
  totalXP: number;
};
// Display player XP and Seed
export const XPSeedsBalance: React.FC<Props> = ({ totalXP }) => {
  const { pSeedBalance } = usePSeedBalance();

  return (
    <HStack flexDirection="row">
      <Tooltip label="Total XP" hasArrow>
        <HStack
          bg="rgba(0,0,0,0.25)"
          border="1px solid #2B2244"
          borderRadius="1rem"
          px={4}
          py={1}
          minW="fit-content"
        >
          <Image src={XPStar} alignSelf="center" alt="XP" boxSize="1rem" />
          <Text color="#FFF" lineHeight={2} fontSize="xs" fontWeight="bold">
            {Math.trunc(totalXP).toLocaleString()}
          </Text>
        </HStack>
      </Tooltip>
      <Tooltip label="pSEEDs" hasArrow>
        <HStack
          bg="rgba(0,0,0,0.25)"
          border="1px solid #2B2244"
          borderRadius="1rem"
          px={4}
          py={1}
          minW="fit-content"
        >
          <Image
            src={SeedMarket}
            alignSelf="center"
            alt="Seed"
            boxSize="1rem"
          />
          <Text color="#FFF" lineHeight={2} fontSize="xs" fontWeight="bold">
            {parseInt(
              amountToDecimal(pSeedBalance || '0', 18),
              10,
            ).toLocaleString()}
          </Text>
        </HStack>
      </Tooltip>
    </HStack>
  );
};
