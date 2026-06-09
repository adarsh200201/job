import React from 'react';
import { useParams } from 'react-router-dom';
import GovtJobsCategory from './GovtJobsCategory.jsx';
import JobDetails from './JobDetails.jsx';
import { MEGA_CATEGORIES } from '../utils/categoryConfig.js';

const BASIC_CATEGORIES = [
  'govt-jobs',
  'upsc-jobs',
  'ssc-jobs',
  'railway-jobs',
  'banking-jobs',
  'defence-jobs',
  'other-govt-jobs',
  'teaching-jobs',
  'psu-jobs',
  'results',
  'admit-cards',
  'answer-keys'
];

export default function RootSlugHandler() {
  const { slug } = useParams();

  const isCategory = BASIC_CATEGORIES.includes(slug) || !!MEGA_CATEGORIES[slug];

  if (isCategory) {
    return <GovtJobsCategory categoryKey={slug} />;
  }

  // Fallback to JobDetails component for normal job posts
  return <JobDetails />;
}
