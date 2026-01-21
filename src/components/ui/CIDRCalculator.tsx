"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CIDRResult {
  network: string;
  firstIP: string;
  lastIP: string;
  totalIPs: number;
  usableIPs: number;
  awsReserved: string[];
  subnetMask: string;
  wildcardMask: string;
}

const CIDRCalculator = () => {
  const [cidr, setCidr] = useState("10.0.0.0/16");
  const [result, setResult] = useState<CIDRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseCIDR = useCallback((cidrInput: string): CIDRResult | null => {
    const cidrRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/;
    const match = cidrInput.trim().match(cidrRegex);

    if (!match) return null;

    const octets = [
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3]),
      parseInt(match[4]),
    ];
    const prefix = parseInt(match[5]);

    // Validate octets
    for (const octet of octets) {
      if (octet < 0 || octet > 255) return null;
    }

    // Validate prefix
    if (prefix < 0 || prefix > 32) return null;

    // Calculate network address
    const ipNum =
      (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
    const mask = prefix === 0 ? 0 : ~((1 << (32 - prefix)) - 1);
    const networkNum = ipNum & mask;

    // Calculate total IPs
    const totalIPs = Math.pow(2, 32 - prefix);
    const usableIPs = Math.max(0, totalIPs - 5); // AWS reserves 5 IPs per subnet

    // Convert back to IP strings
    const numToIP = (num: number): string => {
      return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ].join(".");
    };

    const network = numToIP(networkNum >>> 0);
    const broadcastNum = networkNum + totalIPs - 1;
    const lastIP = numToIP(broadcastNum >>> 0);

    // AWS reserved IPs (first 4 + last 1)
    const awsReserved = [
      `${numToIP(networkNum >>> 0)} - Network address`,
      `${numToIP((networkNum + 1) >>> 0)} - VPC router`,
      `${numToIP((networkNum + 2) >>> 0)} - DNS server`,
      `${numToIP((networkNum + 3) >>> 0)} - Future use`,
      `${numToIP(broadcastNum >>> 0)} - Broadcast`,
    ];

    // Subnet mask
    const subnetMask = numToIP(mask >>> 0);
    const wildcardMask = numToIP(~mask >>> 0);

    return {
      network,
      firstIP: numToIP((networkNum + 4) >>> 0),
      lastIP: numToIP((broadcastNum - 1) >>> 0),
      totalIPs,
      usableIPs,
      awsReserved,
      subnetMask,
      wildcardMask,
    };
  }, []);

  const handleCalculate = () => {
    setError(null);
    const parsed = parseCIDR(cidr);
    if (parsed) {
      setResult(parsed);
    } else {
      setError("Invalid CIDR notation. Use format: 10.0.0.0/16");
      setResult(null);
    }
  };

  const commonCIDRs = [
    { label: "VPC (/16)", value: "10.0.0.0/16", ips: "65,536 IPs" },
    { label: "Subnet (/24)", value: "10.0.1.0/24", ips: "256 IPs" },
    { label: "Small (/28)", value: "10.0.1.0/28", ips: "16 IPs" },
  ];

  return (
    <div className="my-8 p-6 bg-bg-cream/50 border border-text-charcoal/10 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-serif text-text-charcoal">
            CIDR Calculator
          </h3>
          <p className="text-sm text-text-olive">
            Calculate IP ranges and AWS-usable addresses
          </p>
        </div>
      </div>

      {/* Quick Select */}
      <div className="mb-4">
        <p className="text-xs text-text-olive mb-2 uppercase tracking-wider font-serif">
          Quick Select
        </p>
        <div className="flex flex-wrap gap-2">
          {commonCIDRs.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setCidr(item.value);
                const parsed = parseCIDR(item.value);
                if (parsed) {
                  setResult(parsed);
                  setError(null);
                }
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                cidr === item.value
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-700"
                  : "bg-bg-paper border-text-charcoal/10 text-text-taupe hover:border-amber-500/30"
              }`}
            >
              {item.label}
              <span className="ml-1 text-xs opacity-70">({item.ips})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
          placeholder="e.g., 10.0.0.0/16"
          className="flex-1 px-4 py-2 rounded-lg border border-text-charcoal/10 bg-bg-paper
                     font-mono text-sm focus:outline-none focus:border-amber-500/50
                     focus:ring-2 focus:ring-amber-500/20"
        />
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600
                     transition-colors font-medium text-sm"
        >
          Calculate
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-accent-terracotta/10 border border-accent-terracotta/20
                       rounded-lg text-accent-terracotta text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={cidr}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-bg-paper rounded-lg border border-text-charcoal/10">
                <p className="text-xs text-text-olive mb-1">Total IPs</p>
                <p className="text-xl font-mono text-text-charcoal">
                  {result.totalIPs.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-accent-moss/10 rounded-lg border border-accent-moss/20">
                <p className="text-xs text-accent-moss mb-1">Usable in AWS</p>
                <p className="text-xl font-mono text-accent-moss font-bold">
                  {result.usableIPs.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-bg-paper rounded-lg border border-text-charcoal/10">
                <p className="text-xs text-text-olive mb-1">Subnet Mask</p>
                <p className="text-sm font-mono text-text-charcoal">
                  {result.subnetMask}
                </p>
              </div>
              <div className="p-3 bg-bg-paper rounded-lg border border-text-charcoal/10">
                <p className="text-xs text-text-olive mb-1">Wildcard Mask</p>
                <p className="text-sm font-mono text-text-charcoal">
                  {result.wildcardMask}
                </p>
              </div>
            </div>

            {/* IP Range */}
            <div className="p-4 bg-bg-paper rounded-lg border border-text-charcoal/10">
              <p className="text-xs text-text-olive mb-2 uppercase tracking-wider font-serif">
                Usable IP Range
              </p>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="px-2 py-1 bg-accent-sage/20 rounded text-accent-moss">
                  {result.firstIP}
                </span>
                <span className="text-text-olive">to</span>
                <span className="px-2 py-1 bg-accent-sage/20 rounded text-accent-moss">
                  {result.lastIP}
                </span>
              </div>
            </div>

            {/* AWS Reserved IPs */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700 mb-2 uppercase tracking-wider font-serif">
                AWS Reserved IPs (5 per subnet)
              </p>
              <div className="space-y-1">
                {result.awsReserved.map((reserved, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <code className="text-amber-800">{reserved}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Subnet Division (for /16) */}
            {cidr.endsWith("/16") && (
              <div className="p-4 bg-bg-paper rounded-lg border border-text-charcoal/10">
                <p className="text-xs text-text-olive mb-3 uppercase tracking-wider font-serif">
                  Subnet Division Example
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Public 1", cidr: "/24", color: "bg-blue-100 border-blue-300" },
                    { label: "Public 2", cidr: "/24", color: "bg-blue-100 border-blue-300" },
                    { label: "Private 1", cidr: "/24", color: "bg-purple-100 border-purple-300" },
                    { label: "Private 2", cidr: "/24", color: "bg-purple-100 border-purple-300" },
                  ].map((subnet, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded border ${subnet.color} text-center`}
                    >
                      <p className="text-xs font-medium">{subnet.label}</p>
                      <p className="text-xs text-text-olive">{subnet.cidr}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-text-olive">
                  A /16 VPC can contain 256 /24 subnets, each with 251 usable IPs
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CIDRCalculator;
