process.env.NODE_ENV = 'test';
import '../src/helpers/connectDatabase';

// Collections
import { User } from "../src/models/user.model";
import { Post } from '../src/models/post.model';

beforeEach('Clear all data for test', async () => {
    await User.remove({});
    await Post.remove({});
});
