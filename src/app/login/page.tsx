"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {startLogin} from "@/service/api";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    captcha: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    startLogin(values.email, values.captcha).then((res) => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
}

export default function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            captcha: ""
        },
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <div>
                            <FormItem>
                                <FormLabel>邮箱</FormLabel>
                                <FormControl>
                                    <Input placeholder="请输入邮箱" {...field} />
                                </FormControl>
                            </FormItem>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="captcha"
                    render={({ field }) => (
                        <div>
                            <FormItem>
                                <FormLabel>captcha</FormLabel>
                                <FormControl>
                                    <Input placeholder="请输入captcha" {...field} />
                                </FormControl>
                            </FormItem>
                        </div>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
