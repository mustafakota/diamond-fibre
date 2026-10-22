async function test() {
  const res = await fetch('http://localhost:3000/en/wholesale');
  const text = await res.text();
  console.log('Includes <form:', text.includes('<form'));
  console.log('Includes type="submit":', text.includes('type="submit"'));
  console.log('Includes Submit Wholesale:', text.includes('Submit Wholesale'));
  const match = text.match(/<button[^>]*type="submit"[^>]*>/);
  console.log('Button tag:', match ? match[0] : 'NOT FOUND');
}
test();
