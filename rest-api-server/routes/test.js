const functionArgs = [{"Address": "user101", {"Fiat":"1000000"}, {"ST_1":"100"}];

try {
  // JSON 배열로 변환
  const parsedArgs = functionArgs.map(arg => JSON.parse(arg));
  console.log('Parsed Args:', parsedArgs);
} catch (error) {
  console.error('Error parsing functionArgs:', error);
}