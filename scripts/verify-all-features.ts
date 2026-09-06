import { authService } from '../src/services/appwrite/auth';
import { membersService } from '../src/services/appwrite/members';
import { jobsService } from '../src/services/appwrite/jobs';
import { inquiriesService } from '../src/services/appwrite/inquiries';
import { eventsService } from '../src/services/appwrite/events';
import { newsService } from '../src/services/appwrite/news';

async function verifyAllFeatures() {
  console.log('🧪 ACCI Full-Stack Feature Verification');
  console.log('========================================');

  const testEmail = `agrawal_trader_${Date.now()}@accijabalpur.org`;
  const testPassword = 'Password@12345';
  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean, detail = '') {
    total++;
    if (condition) {
      console.log(`✅ [${total}] ${name} — PASSED ${detail}`);
      passed++;
    } else {
      console.error(`❌ [${total}] ${name} — FAILED ${detail}`);
    }
  }

  try {
    // 1. SIGN UP (REGISTER)
    console.log('\n1. Testing User Registration (Sign Up)...');
    const newUser = await authService.register({
      name: 'Ramesh Chandra Agrawal',
      email: testEmail,
      password: testPassword,
      phone: '+91 9425154321',
      city: 'Jabalpur',
    });
    assert('User Registration', Boolean(newUser && newUser.email === testEmail), `ID: ${newUser.userId}`);

    // 2. SIGN IN (LOGIN)
    console.log('\n2. Testing User Authentication (Sign In)...');
    const loggedIn = await authService.login(testEmail, testPassword);
    assert('User Login', Boolean(loggedIn && loggedIn.email === testEmail), `Role: ${loggedIn.role}`);

    // 3. ADMIN LOGIN
    console.log('\n3. Testing Admin Login...');
    const adminUser = await authService.login('admin@acci.org', 'Admin@12345');
    assert('Admin Login', Boolean(adminUser && adminUser.role === 'admin'), `Role: ${adminUser.role}`);

    // 4. POST / LIST BUSINESS
    console.log('\n4. Testing Business Listing Submission...');
    const newBiz = await membersService.createMember({
      businessName: 'Shree Mahamaya Steel Trading',
      legalName: 'Mahamaya Ispat Pvt. Ltd.',
      ownerName: 'Ramesh Chandra Agrawal',
      category: 'Wholesale',
      industry: 'Steel & Hardware Trading',
      description: 'Authorized wholesale stockist of TMT rebars, structural steel, and GI pipes in Jabalpur.',
      phone: '+91 9425154321',
      whatsapp: '919425154321',
      email: 'sales@mahamayasteel.com',
      address: 'Shop 22, Transport Nagar, Karmeta Bypass',
      city: 'Jabalpur',
      pinCode: '482003',
      timing: 'Mon–Sat: 09:30 AM – 07:00 PM',
      gst: '23AABCM9988P1ZZ',
      estYear: '2010',
      employees: '14',
      plan: 'Pro',
      featured: false,
      rating: 0,
      reviewCount: 0,
    });
    assert('Create Business Listing', Boolean(newBiz && newBiz.businessName.includes('Mahamaya')), `ID: ${newBiz.id}, Status: ${newBiz.status}`);

    // 5. QUERY DIRECTORY & FILTERS
    console.log('\n5. Testing Directory Query & Filtering...');
    const dirResults = await membersService.getMembers({ search: 'Mahamaya', status: 'all' });
    assert('Search Directory', dirResults.members.length > 0, `Found: ${dirResults.total}`);

    // 6. ADMIN MODERATION: APPROVE BUSINESS
    console.log('\n6. Testing Business Approval Moderation...');
    const approved = await membersService.updateMemberStatus(newBiz.id, 'approved');
    assert('Approve Business Listing', approved === true, `Status changed to approved`);

    // 7. POST A JOB VACANCY
    console.log('\n7. Testing Job Vacancy Posting...');
    const newJob = await jobsService.createJob({
      company: 'Shree Mahamaya Steel Trading',
      title: 'TMT Sales Executive & Mandi Coordinator',
      category: 'Sales & Marketing',
      jobType: 'Full-Time',
      urgency: 'Urgent',
      salary: '₹22,000 – ₹30,000 / month',
      location: 'Transport Nagar, Jabalpur',
      description: 'Responsible for B2B wholesale client visits, builder coordination, and delivery tracking.',
      skills: 'Field Sales, Hindi/English, Two Wheeler License',
      contactWhatsApp: '919425154321',
      contactEmail: 'sales@mahamayasteel.com',
    });
    assert('Post Job Vacancy', Boolean(newJob && newJob.id), `Job ID: ${newJob.id}, Title: ${newJob.title}`);

    // 8. SUBMIT CONTACT INQUIRY
    console.log('\n8. Testing Secretariat Contact Submission...');
    const inquiry = await inquiriesService.submitContact({
      name: 'Vipin Agrawal',
      email: 'vipin@example.com',
      phone: '+91 9826112233',
      subject: 'Membership Verification',
      message: 'Kindly assist with verifying my manufacturing unit in Richhai Industrial Area Phase 2.',
    });
    assert('Submit Contact Inquiry', Boolean(inquiry && inquiry.id), `Inquiry ID: ${inquiry.id}`);

    // 9. SUBMIT CUSTOMER REVIEW
    console.log('\n9. Testing Business Review Submission...');
    const review = await membersService.addReview({
      vendorId: newBiz.id,
      businessName: newBiz.businessName,
      reviewerName: 'Sunil Gupta',
      rating: 5,
      reviewText: 'Prompt delivery of structural steel at competitive rates. Very reliable member firm.',
    });
    assert('Submit Review', Boolean(review && review.id), `Review ID: ${review.id}, Stars: ${review.rating}`);

    // 10. EVENTS FETCHING
    console.log('\n10. Testing Events Calendar Retrieval...');
    const events = await eventsService.getEvents();
    assert('Retrieve Events', events.length >= 3, `Count: ${events.length}`);

    // 11. NEWS & CIRCULARS FETCHING
    console.log('\n11. Testing Circulars & News Retrieval...');
    const news = await newsService.getNews();
    assert('Retrieve Circulars', news.length >= 3, `Count: ${news.length}`);

    console.log('\n========================================');
    console.log(`🏁 VERIFICATION SUMMARY: ${passed} / ${total} Features Verified.`);
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

verifyAllFeatures();
