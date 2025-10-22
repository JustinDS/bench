"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Vendors } from "@/lib/types/database/vendors";
import { Series } from "@/lib/types/database/series";
import { Manufacturers } from "@/lib/types/database/manufacturers";
import SeriesManager from "@/app/components/series/seriesManager";

export default function CPU() {
  return <SeriesManager />;
}
