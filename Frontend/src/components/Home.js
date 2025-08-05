import { useState, useEffect } from "react";
import { Spinner, Container } from "react-bootstrap";
import PostCard from "../components/PostCard";
import SurveyCard from "../components/SurveyCard";
import PostForm from "../components/PostForm";
import { getPosts } from "../configs/LoadData";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts(page);
      if (page === 1) setPosts(data);
      else setPosts((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Lỗi khi load bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (!loading && scrollY + viewportHeight >= fullHeight * 0.8) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <Container className="mt-4">
      <PostForm onPostCreated={handlePostCreated} />
      {posts.map((p) =>
        Array.isArray(p.post.surveyOptions) &&
        p.post.surveyOptions.length > 0 ? (
          <SurveyCard key={p.post.id} post={p.post} totalReacts={p.post.totalReacts}
          />
        ) : (
          <PostCard key={p.post.id} post={p.post} totalReacts={p.post.totalReacts} />
        )
      )}

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}
    </Container>
  );
};

export default Home;
