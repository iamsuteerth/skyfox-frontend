'use client';

import React, { useState, useEffect } from 'react';

import {
  VStack,
  Grid,
  GridItem,
  useBreakpointValue,
  Box,
  Heading
} from '@chakra-ui/react';

import { useCustomToast } from '@/app/components/ui/custom-toast';

import { fetchRevenueSummary } from '@/services/revenue-service';
import { RevenueSummary } from '@/services/revenue-service';

import HeaderStats from './header-stats';
import CsvReportArea from './csv-report-area';
import StatsVisualization from './stats-visualization';

const Dashboard = () => {
  const { showToast } = useCustomToast();
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<RevenueSummary | null>(null);

  useEffect(() => {
    const loadSummaryData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRevenueSummary(showToast);
        setSummaryData(data);
      } catch (error) {
        console.error('Failed to load summary data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummaryData();
  }, [showToast]);

  const layout = useBreakpointValue({
    base: 'mobile',
    md: 'desktop'   
  });

  const containerBg = useBreakpointValue({
    base: 'transparent',
    md: 'background.primary'
  });

  return (
    <Box py={4} px={{ base: 2, md: 6 }}>
      <VStack w="full" spacing={6} align="flex-start">
        <Heading size="lg" color="text.primary" mb={2}>
          Admin Dashboard
        </Heading>

        <HeaderStats
          isLoading={isLoading}
          summaryData={summaryData}
        />

        <Grid
          templateColumns={layout === 'desktop' ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
          gap={6}
          w="full"
        >
          <GridItem colSpan={layout === 'desktop' ? 1 : 'auto'}>
            <CsvReportArea />
          </GridItem>

          <GridItem colSpan={layout === 'desktop' ? 2 : 'auto'}>
            <StatsVisualization />
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Dashboard;
