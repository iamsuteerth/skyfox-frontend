'use client';

import { ReactNode } from 'react';
import { Card, CardProps, CardBody } from '@chakra-ui/react';

interface NeumorphicCardProps extends CardProps {
  children: ReactNode;
  padding?: string | object;
}

export default function NeumorphicCard({
  children,
  padding = { base: 6, md: 10 },
  ...rest
}: NeumorphicCardProps) {
  const neumorphicStyle = {
    borderRadius: '50px',
    boxShadow: `20px 20px 60px #D8DADC, -20px -20px 60px #FFFFFF`,
    transition: 'all 0.3s ease-in-out',
    _hover: {
      boxShadow: `15px 15px 45px #D8DADC, -15px -15px 45px #FFFFFF`,
    }
  };

  return (
    <Card
      bg="background.primary"
      overflow="hidden"
      border="none"
      {...neumorphicStyle}
      {...rest}
    >
      <CardBody p={padding}>
        {children}
      </CardBody>
    </Card>
  );
}
