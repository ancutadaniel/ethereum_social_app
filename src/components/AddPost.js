import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

const AddPost = ({ contract, accounts, showPosts }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (content) {
        await contract.methods.createPost(content).send({
          from: accounts[0],
        });
      }
      showPosts();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading}>
      <Form.Input
        label='Content'
        placeholder={`What's in your mind?`}
        name='content'
        value={content}
        onChange={handleContent}
        required
      />

      <Button color='purple' type='submit'>
        Share
      </Button>
    </Form>
  );
};

export default AddPost;
