import axios from "axios";

const API_URL = "https://bb0momjgae.execute-api.us-east-1.amazonaws.com/Stage"; // replace with your API URL
const PASSWORD = "password";

// The user all others will follow
const BULAT_ALIAS = "@bulat";
const BULAT_IMAGE = "https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/@bulat.jpg";

// Number of users to create
const NUM_USERS = 10600;

// Utility function to create a user
async function createUser(alias: string) {
    const request = {
      alias: alias,
      password: "password",
      firstName: "Poster",
      lastName: "User",
      userImageBytes: Buffer.from([1, 2, 3]).toString("base64"),
      imageFileExtension: "png",
    };

  try {
    const resp = await axios.post(`${API_URL}/user/create`,  request );
    console.log(`Created user ${alias}`);
    return resp.data.token;
  } catch (err) {
    console.error(`Failed to create ${alias}:`);
    console.log(`${err}`)
  }
}

// Utility function to login a user and get their token
async function loginUser(alias: string) {
  try {
    const resp = await axios.post(`${API_URL}/user/login`, {
      alias: alias,
      password: PASSWORD
    });
    return resp.data.token;
  } catch (err) {
    console.error(`Failed to login ${alias}:`);
    return null;
  }
}

// Utility function to follow @bulat
// Utility function to follow @bulat
async function followBulat(token: string) {
  try {
   const resp =  await axios.post(`${API_URL}/followers/follow`, {
      token: token,  // include token in body
      user: { 
        alias: BULAT_ALIAS,
        imageUrl: BULAT_IMAGE ,
        firstName: "Test",
        lastName: "User"
      }
    });
    console.log(`Successfully followed @bulat`);
  } catch (err) {
    console.error(`Failed to follow @bulat:`, err);
  }
}


const BATCH_SIZE = 10;

(async () => {
  for (let i = 10490; i <= NUM_USERS; i += BATCH_SIZE) {
    const batch = [];
    for (let j = i; j < i + BATCH_SIZE && j <= NUM_USERS; j++) {
      const alias = `@user${j}`;
      batch.push(
        (async () => {
          const token = await createUser(alias);
          if (token) {
            await followBulat(token.token);
            console.log(`${alias} now follows ${BULAT_ALIAS}`);
          }
        })()
      );
    }
    await Promise.all(batch); // wait for the batch to finish before next
  }
})();


