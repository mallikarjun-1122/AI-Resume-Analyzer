import {
  FaRobot,
  FaShieldAlt,
  FaBolt,
  FaLightbulb,
} from "react-icons/fa";
import { motion } from "framer-motion";

function Stats() {
  const reasons = [
    {
      icon: <FaRobot size={40} className="text-blue-600" />,
      title: "AI Powered Analysis",
      description:
        "Advanced AI evaluates your resume, identifies weaknesses, and provides personalized recommendations.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-100 to-blue-50",
    },
    {
      icon: <FaShieldAlt size={40} className="text-green-600" />,
      title: "ATS Optimized",
      description:
        "Improve your resume's compatibility with Applicant Tracking Systems used by top companies.",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-100 to-green-50",
    },
    {
      icon: <FaBolt size={40} className="text-yellow-600" />,
      title: "Instant Results",
      description:
        "Receive ATS scores, missing skills, interview questions, and project suggestions in seconds.",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-100 to-yellow-50",
    },
    {
      icon: <FaLightbulb size={40} className="text-purple-600" />,
      title: "Career Guidance",
      description:
        "Get a personalized learning roadmap and actionable steps to increase your chances of getting hired.",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-100 to-purple-50",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-80 h-80 bg-blue-300 rounded-full blur-[140px] opacity-30"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 rounded-full blur-[140px] opacity-30"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full blur-[140px] opacity-20"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Resume Analyzer
            </span>
          </h2>

          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-16">
            Designed to help students and professionals create ATS-friendly resumes,
            improve interview readiness, and accelerate career growth using AI.
          </p>
        </motion.div>

        {/* Stats/Reasons Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-blue-200/50 hover:border-blue-300 hover:-translate-y-3 transition-all duration-500"
            >
              {/* Icon container with gradient */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.bgColor} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition duration-500 group-hover:shadow-lg`}>
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {item.description}
              </p>

              {/* Decorative line on hover */}
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-gray-200/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-blue-600">95%</p>
              <p className="text-sm text-gray-600 mt-2">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-green-600">10K+</p>
              <p className="text-sm text-gray-600 mt-2">Resumes Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-purple-600">4.9</p>
              <p className="text-sm text-gray-600 mt-2">User Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-orange-600">500+</p>
              <p className="text-sm text-gray-600 mt-2">Companies Trust</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
          >
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;