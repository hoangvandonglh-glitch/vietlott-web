// ===== VIETLOTT AI PREDICTION ENGINE =====
// Sử dụng các chiến lược thống kê và AI để dự đoán số

const PredictionEngine = (() => {
    // Configuration for each lottery type
    const LOTTERY_CONFIG = {
        power655: {
            name: 'Power 6/55',
            minNumber: 1,
            maxNumber: 55,
            numbersToSelect: 6,
            lowHighSplit: 27, // 1-27 low, 28-55 high
            sumRange: { min: 140, max: 196 },
            avgSum: 168
        },
        mega645: {
            name: 'Mega 6/45',
            minNumber: 1,
            maxNumber: 45,
            numbersToSelect: 6,
            lowHighSplit: 22, // 1-22 low, 23-45 high
            sumRange: { min: 115, max: 161 },
            avgSum: 138
        }
    };

    // ===== UTILITY FUNCTIONS =====

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function getFrequencyData(lotteryType) {
        // Simulated frequency data (in real app, would come from historical-data.js)
        const config = LOTTERY_CONFIG[lotteryType];
        const frequencies = {};

        // Generate simulated frequency data with some variation
        for (let i = config.minNumber; i <= config.maxNumber; i++) {
            // Create a bell curve distribution with some randomness
            const distance = Math.abs(i - config.maxNumber / 2);
            const baseFreq = 50 - distance / 2;
            frequencies[i] = Math.max(10, baseFreq + getRandomInt(-15, 15));
        }

        return frequencies;
    }

    function categorizeNumbers(frequencies, config) {
        const numbers = Object.keys(frequencies).map(Number);
        const sorted = numbers.sort((a, b) => frequencies[b] - frequencies[a]);

        const third = Math.floor(sorted.length / 3);

        return {
            hot: sorted.slice(0, third),
            moderate: sorted.slice(third, third * 2),
            cold: sorted.slice(third * 2)
        };
    }

    // ===== VALIDATION FUNCTIONS =====

    function countEvenOdd(numbers) {
        const even = numbers.filter(n => n % 2 === 0).length;
        const odd = numbers.length - even;
        return { even, odd };
    }

    function countLowHigh(numbers, split) {
        const low = numbers.filter(n => n <= split).length;
        const high = numbers.length - low;
        return { low, high };
    }

    function calculateSum(numbers) {
        return numbers.reduce((sum, n) => sum + n, 0);
    }

    function hasConsecutive(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i + 1] - sorted[i] === 1) {
                return true;
            }
        }
        return false;
    }

    function isBalancedDistribution(numbers, maxNumber) {
        // Check if numbers are well distributed across the range
        const ranges = Math.ceil(maxNumber / 10);
        const distribution = new Array(ranges).fill(0);

        numbers.forEach(num => {
            const rangeIndex = Math.min(Math.floor((num - 1) / 10), ranges - 1);
            distribution[rangeIndex]++;
        });

        // Good distribution: no range has more than 3 numbers
        return distribution.every(count => count <= 3);
    }

    function avoidsCommonPatterns(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);

        // Check for all consecutive (1,2,3,4,5,6)
        let allConsecutive = true;
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i + 1] - sorted[i] !== 1) {
                allConsecutive = false;
                break;
            }
        }
        if (allConsecutive) return false;

        // Check for all multiples of 5 (5,10,15,20,25,30)
        const allMultiplesOf5 = sorted.every(n => n % 5 === 0);
        if (allMultiplesOf5) return false;

        // Check if all numbers are <= 31 (birthday pattern)
        const allBirthday = sorted.every(n => n <= 31);
        if (allBirthday) return false;

        return true;
    }

    // ===== AI SCORING SYSTEM =====

    function calculateAIScore(numbers, lotteryType) {
        const config = LOTTERY_CONFIG[lotteryType];
        let score = 0;
        const analysis = {};

        // 1. Even/Odd Balance (20 points)
        const { even, odd } = countEvenOdd(numbers);
        analysis.evenOdd = { even, odd };

        if ((even === 3 && odd === 3) || (even === 2 && odd === 4) || (even === 4 && odd === 2)) {
            score += 20;
            analysis.evenOddScore = 20;
        } else if ((even === 1 && odd === 5) || (even === 5 && odd === 1)) {
            score += 10;
            analysis.evenOddScore = 10;
        } else {
            analysis.evenOddScore = 0;
        }

        // 2. Low/High Balance (20 points)
        const { low, high } = countLowHigh(numbers, config.lowHighSplit);
        analysis.lowHigh = { low, high };

        if ((low === 3 && high === 3) || (low === 2 && high === 4) || (low === 4 && high === 2)) {
            score += 20;
            analysis.lowHighScore = 20;
        } else if ((low === 1 && high === 5) || (low === 5 && high === 1)) {
            score += 10;
            analysis.lowHighScore = 10;
        } else {
            analysis.lowHighScore = 0;
        }

        // 3. Sum Range (15 points)
        const sum = calculateSum(numbers);
        analysis.sum = sum;

        if (sum >= config.sumRange.min && sum <= config.sumRange.max) {
            score += 15;
            analysis.sumScore = 15;
        } else {
            const distance = Math.min(
                Math.abs(sum - config.sumRange.min),
                Math.abs(sum - config.sumRange.max)
            );
            analysis.sumScore = Math.max(0, 15 - distance);
            score += analysis.sumScore;
        }

        // 4. Consecutive Numbers (15 points)
        const hasConsec = hasConsecutive(numbers);
        analysis.hasConsecutive = hasConsec;
        analysis.consecutiveScore = hasConsec ? 15 : 0;
        score += analysis.consecutiveScore;

        // 5. Distribution (10 points)
        const balanced = isBalancedDistribution(numbers, config.maxNumber);
        analysis.isBalanced = balanced;
        analysis.distributionScore = balanced ? 10 : 5;
        score += analysis.distributionScore;

        // 6. Avoids Common Patterns (10 points)
        const avoidsPatterns = avoidsCommonPatterns(numbers);
        analysis.avoidsPatterns = avoidsPatterns;
        analysis.patternScore = avoidsPatterns ? 10 : 0;
        score += analysis.patternScore;

        // 7. Has numbers > 31 (10 points)
        const numbersAbove31 = numbers.filter(n => n > 31).length;
        analysis.numbersAbove31 = numbersAbove31;

        if (numbersAbove31 >= 2) {
            score += 10;
            analysis.above31Score = 10;
        } else if (numbersAbove31 === 1) {
            score += 5;
            analysis.above31Score = 5;
        } else {
            analysis.above31Score = 0;
        }

        return { score, analysis };
    }

    // ===== PREDICTION STRATEGIES =====

    function balancedMixStrategy(lotteryType) {
        const config = LOTTERY_CONFIG[lotteryType];
        const frequencies = getFrequencyData(lotteryType);
        const categorized = categorizeNumbers(frequencies, config);

        let numbers = [];

        // 2 hot numbers
        numbers.push(...shuffleArray(categorized.hot).slice(0, 2));

        // 2 moderate numbers
        numbers.push(...shuffleArray(categorized.moderate).slice(0, 2));

        // 1 cold number
        numbers.push(...shuffleArray(categorized.cold).slice(0, 1));

        // 1 random from remaining
        const remaining = [];
        for (let i = config.minNumber; i <= config.maxNumber; i++) {
            if (!numbers.includes(i)) {
                remaining.push(i);
            }
        }
        numbers.push(shuffleArray(remaining)[0]);

        // Adjust if needed to meet criteria
        numbers = adjustToMeetCriteria(numbers, lotteryType);

        return numbers.sort((a, b) => a - b);
    }

    function hotNumbersStrategy(lotteryType) {
        const config = LOTTERY_CONFIG[lotteryType];
        const frequencies = getFrequencyData(lotteryType);
        const categorized = categorizeNumbers(frequencies, config);

        // 4 hot, 1 moderate, 1 cold
        let numbers = [
            ...shuffleArray(categorized.hot).slice(0, 4),
            ...shuffleArray(categorized.moderate).slice(0, 1),
            ...shuffleArray(categorized.cold).slice(0, 1)
        ];

        numbers = adjustToMeetCriteria(numbers, lotteryType);
        return numbers.sort((a, b) => a - b);
    }

    function coldNumbersStrategy(lotteryType) {
        const config = LOTTERY_CONFIG[lotteryType];
        const frequencies = getFrequencyData(lotteryType);
        const categorized = categorizeNumbers(frequencies, config);

        // 1 hot, 1 moderate, 4 cold
        let numbers = [
            ...shuffleArray(categorized.hot).slice(0, 1),
            ...shuffleArray(categorized.moderate).slice(0, 1),
            ...shuffleArray(categorized.cold).slice(0, 4)
        ];

        numbers = adjustToMeetCriteria(numbers, lotteryType);
        return numbers.sort((a, b) => a - b);
    }

    function randomStrategy(lotteryType) {
        const config = LOTTERY_CONFIG[lotteryType];
        let numbers = [];

        while (numbers.length < config.numbersToSelect) {
            const num = getRandomInt(config.minNumber, config.maxNumber);
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }

        return numbers.sort((a, b) => a - b);
    }

    function wheelingStrategy(lotteryType, selectedNumbers) {
        // Generate all 6-number combinations from selected numbers
        const config = LOTTERY_CONFIG[lotteryType];
        const combinations = [];

        function generateCombinations(arr, size, start = 0, current = []) {
            if (current.length === size) {
                combinations.push([...current].sort((a, b) => a - b));
                return;
            }

            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                generateCombinations(arr, size, i + 1, current);
                current.pop();
            }
        }

        generateCombinations(selectedNumbers, config.numbersToSelect);
        return combinations;
    }

    // ===== ADJUSTMENT FUNCTION =====

    function adjustToMeetCriteria(numbers, lotteryType, maxAttempts = 10) {
        const config = LOTTERY_CONFIG[lotteryType];
        let attempts = 0;
        let bestNumbers = [...numbers];
        let bestScore = calculateAIScore(bestNumbers, lotteryType).score;

        while (attempts < maxAttempts) {
            const { score, analysis } = calculateAIScore(numbers, lotteryType);

            if (score >= 70) {
                return numbers;
            }

            // Try to improve the weakest aspect
            if (analysis.evenOddScore < 10) {
                // Adjust even/odd balance
                const { even, odd } = analysis.evenOdd;
                if (even > odd + 2) {
                    // Replace an even with an odd
                    const evenNums = numbers.filter(n => n % 2 === 0);
                    const oddNums = [];
                    for (let i = config.minNumber; i <= config.maxNumber; i++) {
                        if (i % 2 === 1 && !numbers.includes(i)) {
                            oddNums.push(i);
                        }
                    }
                    if (evenNums.length > 0 && oddNums.length > 0) {
                        const replaceIdx = numbers.indexOf(evenNums[0]);
                        numbers[replaceIdx] = oddNums[getRandomInt(0, oddNums.length - 1)];
                    }
                } else if (odd > even + 2) {
                    // Replace an odd with an even
                    const oddNums = numbers.filter(n => n % 2 === 1);
                    const evenNums = [];
                    for (let i = config.minNumber; i <= config.maxNumber; i++) {
                        if (i % 2 === 0 && !numbers.includes(i)) {
                            evenNums.push(i);
                        }
                    }
                    if (oddNums.length > 0 && evenNums.length > 0) {
                        const replaceIdx = numbers.indexOf(oddNums[0]);
                        numbers[replaceIdx] = evenNums[getRandomInt(0, evenNums.length - 1)];
                    }
                }
            }

            if (!analysis.hasConsecutive) {
                // Try to add consecutive numbers
                const sorted = [...numbers].sort((a, b) => a - b);
                for (let i = 0; i < sorted.length - 1; i++) {
                    const gap = sorted[i + 1] - sorted[i];
                    if (gap === 2) {
                        const middle = sorted[i] + 1;
                        if (!numbers.includes(middle)) {
                            numbers[numbers.indexOf(sorted[i + 1])] = middle;
                            break;
                        }
                    }
                }
            }

            if (analysis.numbersAbove31 < 2) {
                // Add numbers > 31
                const below31 = numbers.filter(n => n <= 31);
                const above31Available = [];
                for (let i = 32; i <= config.maxNumber; i++) {
                    if (!numbers.includes(i)) {
                        above31Available.push(i);
                    }
                }
                if (below31.length > 0 && above31Available.length > 0) {
                    const replaceIdx = numbers.indexOf(below31[0]);
                    numbers[replaceIdx] = above31Available[getRandomInt(0, above31Available.length - 1)];
                }
            }

            const newScore = calculateAIScore(numbers, lotteryType).score;
            if (newScore > bestScore) {
                bestScore = newScore;
                bestNumbers = [...numbers];
            }

            attempts++;
        }

        return bestNumbers;
    }

    // ===== MAIN GENERATION FUNCTION =====

    function generate(lotteryType, strategy, numberOfSets = 1, wheelingNumbers = null) {
        const results = [];

        if (strategy === 'wheeling' && wheelingNumbers && wheelingNumbers.length >= 8) {
            const combinations = wheelingStrategy(lotteryType, wheelingNumbers);

            // Return up to numberOfSets combinations
            return combinations.slice(0, numberOfSets).map(numbers => {
                const { score, analysis } = calculateAIScore(numbers, lotteryType);
                return {
                    numbers,
                    score,
                    analysis,
                    strategy: 'Wheeling System',
                    lotteryType,
                    timestamp: new Date().toISOString()
                };
            });
        }

        for (let i = 0; i < numberOfSets; i++) {
            let numbers;
            let strategyName;

            switch (strategy) {
                case 'balanced':
                    numbers = balancedMixStrategy(lotteryType);
                    strategyName = 'AI Smart Pick (Balanced Mix)';
                    break;
                case 'hot':
                    numbers = hotNumbersStrategy(lotteryType);
                    strategyName = 'Hot Numbers Focus';
                    break;
                case 'cold':
                    numbers = coldNumbersStrategy(lotteryType);
                    strategyName = 'Cold Numbers Focus';
                    break;
                case 'random':
                    numbers = randomStrategy(lotteryType);
                    strategyName = 'Quick Random';
                    break;
                default:
                    numbers = balancedMixStrategy(lotteryType);
                    strategyName = 'AI Smart Pick (Balanced Mix)';
            }

            const { score, analysis } = calculateAIScore(numbers, lotteryType);

            results.push({
                numbers,
                score,
                analysis,
                strategy: strategyName,
                lotteryType,
                timestamp: new Date().toISOString()
            });
        }

        return results;
    }

    // Public API
    return {
        generate,
        calculateAIScore,
        LOTTERY_CONFIG
    };
})();

// Make available globally
window.PredictionEngine = PredictionEngine;
