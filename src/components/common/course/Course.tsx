import { AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/navigation';
import { Avatar } from '@radix-ui/react-avatar';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
type Props = {
  id: number;
  subject_name: string;
  createdAt: string;
  user_name: string;
  image_url: string;
};
const Course = ({
  id,
  subject_name,
  createdAt,
  user_name,
  image_url,
}: Props) => {
  return (
    <Link
      href={`/courses/${id}`}
      key={id}
      className="flex flex-col cursor-pointer  border-gradient text-white p-5  rounded-lg  overflow-hidden aspect-video   hover:scale-105 transition-all"
    >
      <div className="flex justify-between">
        <div className="flex  items-center text-3xl">{subject_name}</div>
        <div className="flex  items-center">
          <CalendarIcon className="mr-2 h-4 w-4 " />

          {dayjs(createdAt).format('DD MMMM YYYY')}
        </div>
      </div>
      <div className="mt-auto flex justify-between">
        <div className="  flex gap-2  items-center text-xl">
          <Avatar className="h-7 w-7">
            <AvatarImage
              alt="User Avatar"
              src={image_url || '/teacher.png'}
              className=" rounded-full"
            />
          </Avatar>
          {user_name}
        </div>
      </div>
    </Link>
  );
};

export default Course;
