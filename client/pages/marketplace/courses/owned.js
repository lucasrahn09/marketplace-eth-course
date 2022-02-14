import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
// import { useEffect } from "react";

const OwnedCourses = ({ courses }) => {
  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.data?.map((course) => (
          <OwnedCourseCard key={course.id} course={course}>
            {/* <Message>Purchased!</Message> */}
            <Button>Watch the course</Button>
          </OwnedCourseCard>
        ))}
      </section>
    </>
  );
};

export const getStaticProps = () => {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data,
    },
  };
};

export default function OwnedCoursesLayout({ ...props }) {
  return (
    <BaseLayout>
      <OwnedCourses {...props} />
    </BaseLayout>
  );
}