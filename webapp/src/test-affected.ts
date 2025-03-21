// Test file to verify nx affected:lint works
const doubleQuotesExample = 'This uses double quotes and should be fixed'
const anotherTest = 21

// Missing semicolons again
console.log(doubleQuotesExample, anotherTest)

// Arrow function with linting issues
const arrowFunc = () => {
  const result = anotherTest * 2
  if (result > 50) {
    return 'Greater than 50'
  } else {
    return 'Less than or equal to 50'
  }
}
