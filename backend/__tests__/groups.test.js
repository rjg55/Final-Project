const app = require(`${__dirname}/../app.js`);
const mongoose = require("mongoose");
const { seedDB } = require(`${__dirname}/../seed.js`);
const dotenv = require("dotenv");
const request = require("supertest");

dotenv.config({
  path: `${__dirname}/../.env.test`,
});

beforeAll(async () => {
  connection = await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected, seeding.");
    })
    .catch((err) => {
      console.log(err);
    });
});

beforeEach(() => {
  return seedDB();
});
afterAll(() => {
  mongoose.connection.close();
});

// test("return something", () => {});

describe("GET", () => {
  describe("status 200: returns all groups", () => {
    test("returns an array of all group objects", () => {
      return request(app)
        .get("/api/groups")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.groups)).toBe(true);
          expect(body.groups.length).toBeGreaterThan(0);
          body.groups.forEach((group) => {
            expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              category: expect.any(String),
              description: expect.any(String),
              members: expect.anything,
              admin: expect.any(String),
              thanks: expect.any(String),
            });
          });
        });
    });
  });
  describe("Queries", () => {
    describe("SORTBY", () => {
      test("return an array of groups sorted by title - a-z", () => {
        return request(app)
          .get("/api/groups?sortby=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("title");
          });
      });
      test("return an array of groups sorted by category - a-z", () => {
        return request(app)
          .get("/api/groups?sortby=category")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("category");
          });
      });
      test("return an array of groups sorted by description - a-z", () => {
        return request(app)
          .get("/api/groups?sortby=description")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("description");
          });
      });
      test("return an array of groups sorted by no. of members", () => {
        return request(app)
          .get("/api/groups?sortby=member_count")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("member_count");
          });
      });
      test("return an array of groups sorted by admin - a-z", () => {
        return request(app)
          .get("/api/groups?sortby=admin")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("admin");
          });
      });
      test("return an array of groups sorted by thanks - a-z", () => {
        return request(app)
          .get("/api/groups?sortby=thanks")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("thanks");
          });
      });
    });
    describe("SORTBY - error handling", () => {
      test("status 400 - bad request - column does not exist", () => {
        return request(app)
          .get("/api/groups?sortby=battenberg")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Bad request" });
          });
      });
      test("status 400 - bad request - column does not exist", () => {
        return request(app)
          .get("/api/groups?sortby=battenberg")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Bad request" });
          });
      });
    });
    describe("ORDER", () => {
      test("should return groups sorted by default in descending order", () => {
        return request(app)
          .get("/api/groups?order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("member_count", {
              descending: true,
            });
          });
      });
      test("should return groups sorted by member_count in descending order", () => {
        return request(app)
          .get("/api/groups?sortby=member_count&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.groups).toBeSortedBy("member_count", {
              descending: true,
            });
          });
      });
    });
    describe("ORDER - error handling", () => {
      test("status 400 - bad request - invalid order query", () => {
        return request(app)
          .get("/api/groups?sortby=member_count&order=decreasing")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Bad request" });
          });
      });
    });
  });
});
