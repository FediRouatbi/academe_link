'use client';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import AddTopic from './addTopic/AddTopic';
import { useGetCourseQuery } from '@/hooks/courses';
import { Alert } from '@/components/common/Alert';
import { useDeleteTopicMutation, useGetTopicsByCourse } from '@/hooks/topic';
import { useTopicAtom } from '@/hooks/topic/useTopicAtom';
import { queryClient } from '@/providers/react-query-provider';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import Topic from '@/components/common/topic/Topic';
import { useTranslations } from 'next-intl';
import { RoleCodeType } from '@/lib/next-auth';

const Course = ({
  id,
  role,
}: {
  id: number;
  role: RoleCodeType | undefined;
}) => {
  const t = useTranslations('Course');
  const { data: session } = useSession();

  const { mutate: deleteTopic, isPending: deletePending } =
    useDeleteTopicMutation({
      onSuccess() {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ['topics', id],
        });
        toast?.success('Topic deleted Successfully');
      },
      onError(error) {
        setOpen(false);
        toast?.error(error?.message.split(':')[0]);
      },
    });
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useTopicAtom();

  const { data: courses, isLoading } = useGetCourseQuery({ id });
  const { data: topics } = useGetTopicsByCourse(id);

  const onClickCancel = () => {
    setOpen(false);
  };
  const onClickDelete = () => {
    setOpen(true);
  };
  const onClickConfirm = () => {
    if (!topic?.topic_id) {
      setOpen(false);
      return;
    }

    deleteTopic(topic?.topic_id);
  };

  const classroom_id = courses?.getCourse?.classroom?.classroom_id;
  const teacher_id = courses?.getCourse?.teacher?.teacher_id;
  const subject_id = courses?.getCourse?.subject?.id;
  const canEditTopic =
    session?.user?.user_id === topics?.getTopicsByCourseId?.at(0)?.user_id;
  return (
    <>
      {role === 'TEACHER' && (
        <AddTopic
          courseId={id}
          classroom_id={classroom_id}
          teacher_id={teacher_id}
          subject_id={subject_id}
        />
      )}
      {!topics && isLoading && (
        <div className="min-h-52 flex justify-center items-center">
          <Loader2 className="size-14  animate-spin" />
        </div>
      )}
      {!topics?.getTopicsByCourseId?.length && !isLoading && (
        <div className="min-h-52 flex justify-center items-center">
          {t('empty')}
        </div>
      )}
      <div className="prose  lg:prose-xl px-5 max-w-full pt-10">
        {topics?.getTopicsByCourseId?.map((topic, i) => (
          <Topic
            key={topic?.topic_id}
            topic={topic}
            canEditTopic={canEditTopic}
            onClickDelete={onClickDelete}
          />
        ))}
      </div>
      <Alert
        open={open}
        title={t('title')}
        description={<p>{t('description')}</p>}
        onClickCancel={onClickCancel}
        onClickConfirm={onClickConfirm}
      />
    </>
  );
};

export default Course;
