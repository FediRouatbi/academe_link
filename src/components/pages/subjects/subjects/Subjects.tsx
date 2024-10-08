'use client';
import React, { useState } from 'react';
import Subject from './subject/Subject';
import { useDeleteSubjectMutation, useGetSubjectsQuery } from '@/hooks/subject';
import { type Subject as SubjectType } from '@/gql/graphql';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/providers/react-query-provider';
import { toast } from 'sonner';
import { useEditSubject } from '@/hooks/subject/useEditAtom';
import { useSeachAtom } from '@/hooks/useSeachAtom';
import { Alert } from '@/components/common/Alert';
import { useTranslations } from 'next-intl';

const Subjects = () => {
  const t = useTranslations('Subjects.Alert');

  const [open, setOpen] = useState(false);
  const [debouncedValue] = useSeachAtom();

  const [, setEditSubject] = useEditSubject();

  const { mutate } = useDeleteSubjectMutation({
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast?.success(`Subject ${subject?.name} deleted Successfully`);
      setSubject(null);
    },
    onError(error) {
      toast?.error(`failed deleting ${subject?.name}`);
      setSubject(null);
    },
  });
  const [subject, setSubject] = useState<SubjectType | null>(null);
  const { data } = useGetSubjectsQuery({ search: debouncedValue });

  const onClickDelete = (subject: SubjectType) => {
    setSubject(subject);
    setOpen(true);
  };
  const onClickConfirm = () => {
    if (!subject?.id) return;
    mutate(subject?.id);
    setOpen(false);
    setEditSubject(null);
  };
  const onClickCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="text-center grid gap-5 ">
        {data?.getSubjects.map((subject) => (
          <Subject
            key={subject?.id}
            subject={subject}
            onClickDelete={onClickDelete}
          />
        ))}
      </div>
      <Alert
        open={open}
        title={t('title')}
        description={<p>{t('description', { name: subject?.name })}</p>}
        onClickCancel={onClickCancel}
        onClickConfirm={onClickConfirm}
      />
    </>
  );
};

export default Subjects;
