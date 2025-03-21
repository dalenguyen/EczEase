// Test file with linting issues
const message = 'This uses double quotes and will be fixed'
const testValue = 42
const unused = 'This variable is unused'

// Missing semicolons on purpose
console.log(message, testValue)

// Function with linting issues
function testFunc() {
  const x = 100
  if (x > 50) {
    return 'Greater than 50'
  } else {
    return 'Less than or equal to 50'
  }
}
