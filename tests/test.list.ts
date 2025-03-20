process.env.NODE_ENV = 'test';
import { test } from '@playwright/test';
import health from './health.test';
import userTestCollection from './user.test';

import Course from '../src/models/Course';
import User from '../src/models/User';
import ProgressLog from '../src/models/ProgressLog';
import Quiz from '../src/models/Quiz';
import Topic from '../src/models/Topic';
import Exercise from '../src/models/Exercise';

import dotenvFlow from 'dotenv-flow';
import { connectDB, disconnect } from '../src/config/database';
dotenvFlow.config();

function setUp() {
    //beforeEach clear test database
    test.beforeEach (async () => {
        try {
            await connectDB();
            await Course.deleteMany();
            await User.deleteMany();
            await ProgressLog.deleteMany();
            await Quiz.deleteMany();
            await Topic.deleteMany();
            await Exercise.deleteMany();
        }
        finally {
            await disconnect();
        }
    })

    //afterAll clear test database
    test.afterAll (async () => {
        try {
            await connectDB();
            await Course.deleteMany();
            await User.deleteMany();
            await ProgressLog.deleteMany();
            await Quiz.deleteMany();
            await Topic.deleteMany();
            await Exercise.deleteMany();
        }
        finally {
            await disconnect();
        }
    })
}

setUp();
test.describe(health);
test.describe(userTestCollection);

