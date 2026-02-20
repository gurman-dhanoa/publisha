import * as yup from 'yup';

export const articleSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(10, 'Title is too short'),
  summary: yup.string().required('Short summary is required').max(200),
  content: yup.string().required('Content cannot be empty').min(50),
  featuredImage: yup.mixed().required('A featured image is required'),
});