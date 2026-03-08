import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
}

const SectionHeading = ({ subtitle, title, description, className = "" }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`text-center mb-12 ${className}`}
  >
    {subtitle && <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-2">{subtitle}</p>}
    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h2>
    {description && <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">{description}</p>}
    <div className="w-20 h-0.5 bg-gradient-gold mx-auto mt-6" />
  </motion.div>
);

export default SectionHeading;
