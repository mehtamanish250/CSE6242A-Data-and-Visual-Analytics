package edu.gatech.cse6242;

import java.util.StringTokenizer;
import java.lang.Object;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;
import org.apache.hadoop.fs.FileSystem;

public class Q4 {

  public static class TokenizerMapper
    extends Mapper<Object, Text, IntWritable, IntWritable>{

    private final static IntWritable val_o = new IntWritable(1);
    private final static IntWritable val_i = new IntWritable(-1);
    private IntWritable node = new IntWritable();

    public void map(Object key, Text value, Context context
                    ) throws IOException, InterruptedException {
      StringTokenizer itr = new StringTokenizer(value.toString(), "\n");
      while (itr.hasMoreTokens()) {
        String line = itr.nextToken();
        String token[] = line.split("\t");
        node.set(Integer.parseInt(token[0]));
        context.write(node, val_o);
        node.set(Integer.parseInt(token[1]));
        context.write(node, val_i);

      }
    }
  }

  public static class DifferenceReducer
       extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable> {
    private IntWritable res = new IntWritable();

    public void reduce(IntWritable key, Iterable<IntWritable> values,
                       Context context
                       ) throws IOException, InterruptedException {
      int s = 0;
      for (IntWritable v : values) {
        s = s + v.get();
      }
      res.set(s);
      context.write(key, res);
    }
  }

  public static class FreqTokenMapper
    extends Mapper<Object, Text, IntWritable, IntWritable>{

    private final static IntWritable val = new IntWritable(1);
    private IntWritable node = new IntWritable();

    public void map(Object key, Text value, Context context
                    ) throws IOException, InterruptedException {
      StringTokenizer itr = new StringTokenizer(value.toString(), "\n");
      while (itr.hasMoreTokens()) {
        String line = itr.nextToken();
        String token[] = line.split("\t");

        node.set(Integer.parseInt(token[1]));
        context.write(node, val);
      }
    }
  }

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job prevjob = Job.getInstance(conf, "Q41");

    Path tempout = new Path("tempout");
    FileSystem tmp1 = tempout.getFileSystem(conf);
    tmp1.delete(tempout, true);

    prevjob.setJarByClass(Q4.class);
    prevjob.setMapperClass(TokenizerMapper.class);
    prevjob.setCombinerClass(DifferenceReducer.class);
    prevjob.setReducerClass(DifferenceReducer.class);
    prevjob.setOutputKeyClass(IntWritable.class);
    prevjob.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(prevjob, new Path(args[0]));
    FileOutputFormat.setOutputPath(prevjob,tempout);

    prevjob.waitForCompletion(true);

    Job finaljob = Job.getInstance(conf, "Q42");

    finaljob.setJarByClass(Q4.class);
    finaljob.setMapperClass(FreqTokenMapper.class);
    finaljob.setCombinerClass(DifferenceReducer.class);
    finaljob.setReducerClass(DifferenceReducer.class);
    finaljob.setOutputKeyClass(IntWritable.class);
    finaljob.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(finaljob, tempout);
    FileOutputFormat.setOutputPath(finaljob, new Path(args[1]));
    finaljob.waitForCompletion(true);

    FileSystem tmp2 = tempout.getFileSystem(conf);
    tmp2.delete(tempout, true);

    System.exit(1);
  }
}
