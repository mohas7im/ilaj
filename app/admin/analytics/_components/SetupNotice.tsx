import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"

export function SetupNotice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Google Analytics is not connected</CardTitle>
        <CardDescription>
          Visitor tracking is active on the website, but this dashboard needs read access to show
          the reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            In Google Cloud Console, enable the <strong>Google Analytics Data API</strong>, create a
            service account and download its JSON key.
          </li>
          <li>
            In Google Analytics → Admin → <strong>Property access management</strong>, add the
            service account email as a <strong>Viewer</strong>.
          </li>
          <li>
            Set <code>GA_PROPERTY_ID</code> (the numeric ID from Admin → Property details),{" "}
            <code>GA_CLIENT_EMAIL</code> and <code>GA_PRIVATE_KEY</code> in the environment, then
            redeploy.
          </li>
        </ol>
      </CardContent>
    </Card>
  )
}
