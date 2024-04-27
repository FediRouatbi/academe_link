import React from 'react';
import AddClass from './components/AddClass';
import Classrooms from './components/classrooms/Classrooms';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getClassrooms } from '@/services/classroom';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

const page = async () => {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();
  const accessToken = session?.token?.accessToken;

  await queryClient.prefetchQuery({
    queryKey: ['classrooms'],
    queryFn: () => getClassrooms(accessToken || ''),
    staleTime: 500,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-end">
        <AddClass />
      </div>
      <Classrooms />
    </HydrationBoundary>
  );
};

export default page;
