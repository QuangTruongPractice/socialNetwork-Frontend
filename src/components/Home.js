import { useEffect } from "react";
import { Spinner, Container, Alert } from "react-bootstrap";
import PostCard from "../components/PostCard";
import SurveyCard from "../components/SurveyCard";
import PostForm from "../components/PostForm";
import { getPosts } from "../configs/LoadData";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // Return undefined if no more pages
      return lastPage.length === 0 ? undefined : allPages.length + 1;
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handlePostCreated = (newPost) => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    window.scrollTo(0, 0);
  };

  return (
    <Container className="mt-4">
      <PostForm onPostCreated={handlePostCreated} />

      {status === "pending" ? (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      ) : status === "error" ? (
        <Alert variant="danger">Error: {error.message}</Alert>
      ) : (
        <>
          {data.pages.map((page) =>
            page.map((p) =>
              Array.isArray(p.post.surveyOptions) &&
                p.post.surveyOptions.length > 0 ? (
                <SurveyCard
                  key={p.post.id}
                  post={p.post}
                  totalReacts={p.post.totalReacts}
                />
              ) : (
                <PostCard
                  key={p.post.id}
                  post={p.post}
                  totalReacts={p.post.totalReacts}
                />
              )
            )
          )}
          <div ref={ref} className="text-center my-3">
            {isFetchingNextPage ? (
              <Spinner animation="border" size="sm" />
            ) : hasNextPage ? (
              // Simple observer element
              <span style={{ visibility: 'hidden' }}>Load more</span>
            ) : (
              <p className="text-muted">No more posts</p>
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default Home;
