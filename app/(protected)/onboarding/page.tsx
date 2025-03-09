// app/(protected)/onboarding/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Progress,
  Text,
  useColorMode,
  Icon,
  Circle,
  Flex,
  Stack,
  HStack,
  Show,
  Hide,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import withAuth from "@/hoc/withAuth";
import { MembershipRequestProvider } from "./context/MembershipRequestContext";

const steps = [
  { title: "Basic Information", description: "Personal details and contact info" },
  { title: "Professional Info", description: "Your work and expertise" },
  { title: "Social Presence", description: "Online profiles and networks" },
  { title: "Privacy & Consent", description: "Data usage and permissions" },
  { title: "Success", description: "Complete your registration" },
];

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.50" : "gray.800";
  const sidebarBg = colorMode === "light" ? "blue.500" : "blue.600";
  const stepBg = colorMode === "light" ? "white" : "gray.700";

  async function handleFinish() {
    router.push("/dashboard");
  }

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1 next={() => setCurrentStep(2)} />;
      case 2:
        return <Step2 next={() => setCurrentStep(3)} back={() => setCurrentStep(1)} />;
      case 3:
        return <Step3 next={() => setCurrentStep(4)} back={() => setCurrentStep(2)} />;
      case 4:
        return <Step4 next={() => setCurrentStep(5)} back={() => setCurrentStep(3)} />;
      case 5:
        return <Step5 finish={handleFinish} back={() => setCurrentStep(4)} />;
      default:
        return <Step1 next={() => setCurrentStep(2)} />;
    }
  }

  const currentStepData = steps[currentStep - 1];

  return (
    <MembershipRequestProvider>
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="8xl" p={0}>
          <Flex direction={{ base: "column", md: "row" }} minH="100vh">
            {/* Mobile Progress Indicator */}
            <Show below="md">
              <Box bg={sidebarBg} p={4} color="white">
                <HStack spacing={4} mb={4}>
                  <Circle size="32px" bg="whiteAlpha.300">
                    <Text fontSize="sm">{currentStep}</Text>
                  </Circle>
                  <Box>
                    <Text fontWeight="bold" fontSize="md">
                      {currentStepData.title}
                    </Text>
                    <Text fontSize="sm" opacity={0.8}>
                      {currentStepData.description}
                    </Text>
                  </Box>
                </HStack>
                <Progress
                  value={(currentStep / steps.length) * 100}
                  size="sm"
                  colorScheme="green"
                  borderRadius="full"
                  bg="whiteAlpha.300"
                />
              </Box>
            </Show>

            {/* Desktop Sidebar */}
            <Hide below="md">
              <Box
                w="320px"
                bg={sidebarBg}
                p={8}
                color="white"
                position="sticky"
                top={0}
                h="100vh"
              >
                <Text fontSize="2xl" fontWeight="bold" mb={8}>
                  Your Progress
                </Text>
                <Progress
                  value={(currentStep / steps.length) * 100}
                  size="sm"
                  colorScheme="green"
                  mb={8}
                  borderRadius="full"
                  bg="whiteAlpha.300"
                />
                <Stack spacing={6}>
                  {steps.map((step, index) => (
                    <Box
                      key={index}
                      opacity={currentStep >= index + 1 ? 1 : 0.5}
                      transition="all 0.2s"
                    >
                      <Stack direction="row" spacing={4}>
                        <Circle
                          size="32px"
                          bg={currentStep > index + 1 ? "green.400" : "whiteAlpha.300"}
                          color="white"
                        >
                          {currentStep > index + 1 ? (
                            <Icon as={CheckIcon} />
                          ) : (
                            <Text fontSize="sm">{index + 1}</Text>
                          )}
                        </Circle>
                        <Box>
                          <Text fontWeight="bold" fontSize="md">
                            {step.title}
                          </Text>
                          <Text fontSize="sm" opacity={0.8}>
                            {step.description}
                          </Text>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Hide>

            {/* Main Content */}
            <Box flex="1" p={{ base: 4, md: 8 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    bg={stepBg}
                    borderRadius="xl"
                    boxShadow="xl"
                    p={{ base: 6, md: 8 }}
                    maxW="800px"
                    mx="auto"
                  >
                    {renderStep()}
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Flex>
        </Container>
      </Box>
    </MembershipRequestProvider>
  );
}

export default withAuth(OnboardingPage);
